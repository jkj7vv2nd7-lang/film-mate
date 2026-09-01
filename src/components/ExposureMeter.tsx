'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sun, Moon, Camera } from 'lucide-react';
import { calculateEV, calculateExposurePairs, luminanceToEV, F_STOPS, ISO_VALUES, FILM_PRESETS, SCENE_PRESETS } from '@/lib/exposure';

export default function ExposureMeter({ onEVChange }: { onEVChange?: (ev: number, f: number, t: string, iso: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [measuredEV, setMeasuredEV] = useState<number | null>(null);
  const [iso, setIso] = useState(400);
  const [aperture, setAperture] = useState(5.6);
  const [comp, setComp] = useState(0);
  const [tab, setTab] = useState<'camera'|'scene'|'film'>('camera');
  const [pairs, setPairs] = useState<ReturnType<typeof calculateExposurePairs>>([]);
  const [error, setError] = useState('');

  const update = useCallback((ev: number) => {
    const ce = ev + comp;
    const ep = calculateExposurePairs(ce, iso);
    setPairs(ep);
    const m = ep.find(p => Math.abs(p.evDiff) < 0.5);
    if (m) { onEVChange?.(ce, m.fStop, m.shutterLabel, iso); }
  }, [comp, iso, onEVChange]);

  const startCam = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 320 }, height: { ideal: 240 } } });
      if (videoRef.current) { videoRef.current.srcObject = s; setIsActive(true); setError(''); }
    } catch { setError('カメラにアクセスできません'); }
  }, []);

  const stopCam = useCallback(() => {
    if (videoRef.current?.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); videoRef.current.srcObject = null; }
    setIsActive(false); setMeasuredEV(null); cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (!isActive || !canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const measure = () => {
      if (!videoRef.current || !ctx) return;
      const vw = videoRef.current.videoWidth || 320, vh = videoRef.current.videoHeight || 240;
      canvasRef.current!.width = vw; canvasRef.current!.height = vh;
      ctx.drawImage(videoRef.current, 0, 0, vw, vh);
      const d = ctx.getImageData(0, 0, vw, vh).data;
      let total = 0, count = 0;
      for (let i = 0; i < d.length; i += 16) { total += 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2]; count++; }
      const ev = luminanceToEV(total / count);
      setMeasuredEV(ev);
      update(ev);
      animRef.current = requestAnimationFrame(measure);
    };
    animRef.current = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, update]);

  useEffect(() => { return () => { stopCam(); }; }, [stopCam]);

  const evD = measuredEV !== null ? measuredEV + comp : null;

  return (
    <div className="flex flex-col h-full gap-2 p-3">
      <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
        <video ref={videoRef} playsInline muted className="w-full h-full" />
        <canvas ref={canvasRef} className="hidden" />
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Camera className="w-10 h-10 text-zinc-600" />
            <button onClick={startCam} className="px-5 py-2.5 bg-amber-600 text-white rounded-lg font-bold text-sm active:bg-amber-700">測光スタート</button>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>
        )}
        {isActive && <button onClick={stopCam} className="absolute top-2 right-2 px-3 py-1 bg-black/60 text-white rounded text-xs font-bold">停止</button>}
        {isActive && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-24 h-24 border-2 border-amber-400/60 rounded-full" /></div>}
      </div>

      <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-400">EV値</span>
          {evD !== null ? <span className="text-lg font-bold text-amber-400">EV {evD}</span> : <span className="text-sm text-zinc-500">--- 測光してください ---</span>}
        </div>
        <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">{[-4,-2,0,2,4,6,8,10,12,14,16].map(ev => (<div key={ev} className="flex-1 border-r border-zinc-700/50 flex items-center justify-center"><span className="text-[8px] text-zinc-600">{ev}</span></div>))}</div>
          {evD !== null && <div className="absolute top-0 h-full w-1 bg-amber-400 shadow-lg shadow-amber-400/50 transition-all duration-200" style={{ left: `${Math.max(2, Math.min(98, ((evD+4)/20)*100))}%` }} />}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-zinc-400">露出補正</span>
          <span className={`text-sm font-bold ${comp > 0 ? 'text-amber-400' : comp < 0 ? 'text-blue-400' : 'text-zinc-300'}`}>{comp > 0 ? '+' : ''}{comp} EV</span>
        </div>
        <input type="range" min={-3} max={3} step={0.5} value={comp} onChange={e => { setComp(parseFloat(e.target.value)); if (measuredEV !== null) update(measuredEV); }} className="w-full" />
        <div className="flex justify-between text-[10px] text-zinc-600 mt-1"><span>-3</span><span>0</span><span>+3</span></div>
      </div>

      <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
        {([['camera','カメラ',Sun],['scene','シーン',Moon],['film','フィルム',Camera]] as const).map(([k,l,I]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${tab===k ? 'bg-amber-600 text-white' : 'text-zinc-400'}`}><I className="w-3.5 h-3.5" />{l}</button>
        ))}
      </div>

      {tab === 'scene' && (
        <div className="flex-1 overflow-auto bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="grid grid-cols-2 gap-1 p-2">{SCENE_PRESETS.map(s => (
            <button key={s.name} onClick={() => { setMeasuredEV(s.ev); update(s.ev); }} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-zinc-800 text-left">
              <span className="text-lg">{s.icon}</span><div><div className="text-xs font-bold text-zinc-200">{s.name}</div><div className="text-[10px] text-amber-400">EV {s.ev}</div></div>
            </button>
          ))}</div>
        </div>
      )}

      {tab === 'film' && (
        <div className="flex-1 overflow-auto bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="p-2 space-y-1">{FILM_PRESETS.map(f => (
            <button key={f.name} onClick={() => { setIso(f.iso); if (measuredEV !== null) update(measuredEV); }} className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors ${iso===f.iso ? 'bg-amber-600/20 border border-amber-600/50' : 'hover:bg-zinc-800'}`}>
              <span className="text-xs font-bold text-zinc-200">{f.name}</span><span className="text-xs text-amber-400">ISO {f.iso}</span>
            </button>
          ))}</div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 bg-zinc-900 rounded-xl p-2.5 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block mb-1">ISO</span>
          <select value={iso} onChange={e => { const v=parseInt(e.target.value); setIso(v); if (measuredEV!==null) update(measuredEV); }} className="w-full bg-zinc-800 text-amber-400 text-sm font-bold rounded-lg px-2 py-1.5 border border-zinc-700">{ISO_VALUES.map(i=><option key={i} value={i}>{i}</option>)}</select>
        </div>
        <div className="flex-1 bg-zinc-900 rounded-xl p-2.5 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block mb-1">絞り (F値)</span>
          <select value={aperture} onChange={e => { setAperture(parseFloat(e.target.value)); if (measuredEV!==null) update(measuredEV); }} className="w-full bg-zinc-800 text-amber-400 text-sm font-bold rounded-lg px-2 py-1.5 border border-zinc-700">{F_STOPS.map(f=><option key={f} value={f}>f/{f}</option>)}</select>
        </div>
      </div>

      {pairs.length > 0 && (
        <div className="flex-1 overflow-auto bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="p-2">
            <div className="text-[10px] text-zinc-400 mb-1.5">等価露出テーブル</div>
            <div className="grid grid-cols-4 gap-px bg-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-400">F値</div>
              <div className="bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-400">シャッター</div>
              <div className="bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-400">偏差</div>
              <div className="bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-400">EV</div>
              {pairs.map((p, i) => {
                const ok = Math.abs(p.evDiff) < 0.5;
                return [<div key={i+'a'} className={`${ok?'bg-amber-600/20':'bg-zinc-900'} px-2 py-1.5 text-xs font-bold ${ok?'text-amber-300':'text-zinc-300'}`}>f/{p.fStop}</div>,
                <div key={i+'b'} className={`${ok?'bg-amber-600/20':'bg-zinc-900'} px-2 py-1.5 text-xs ${ok?'text-amber-300':'text-zinc-300'}`}>{p.shutterLabel}</div>,
                <div key={i+'c'} className={`${ok?'bg-amber-600/20':'bg-zinc-900'} px-2 py-1.5 text-[10px] ${ok?'text-green-400':'text-zinc-500'}`}>{p.evDiff===0?'◎':ok?'○':`${p.evDiff>0?'+':''}${p.evDiff}`}</div>,
                <div key={i+'d'} className={`${ok?'bg-amber-600/20':'bg-zinc-900'} px-2 py-1.5 text-[10px] ${ok?'text-amber-300':'text-zinc-300'}`}>{calculateEV(p.fStop, p.shutterSpeed, iso)}</div>];
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
