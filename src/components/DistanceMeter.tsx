'use client';

import { useState } from 'react';
import { Ruler, Focus } from 'lucide-react';
import { calculateDepthOfField, F_STOPS } from '@/lib/exposure';

const DIST_PRESETS = [{l:'0.3m',v:0.3},{l:'0.5m',v:0.5},{l:'0.7m',v:0.7},{l:'1m',v:1},{l:'1.5m',v:1.5},{l:'2m',v:2},{l:'3m',v:3},{l:'5m',v:5},{l:'10m',v:10}];
const FOCALS = [{l:'28mm',v:28},{l:'35mm',v:35},{l:'50mm',v:50},{l:'85mm',v:85}];

export default function DistanceMeter() {
  const [dist, setDist] = useState(3);
  const [focal, setFocal] = useState(50);
  const [ap, setAp] = useState(5.6);
  const dof = calculateDepthOfField(focal, ap, dist);
  const hsLimit = 1/focal;
  const logPos = (m: number) => (Math.log10(Math.max(0.3, m)) - Math.log10(0.3)) / (Math.log10(50) - Math.log10(0.3)) * 100;

  return (
    <div className="flex flex-col h-full gap-2 p-3">
      <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center">
          <div className="text-center"><Ruler className="w-8 h-8 text-zinc-600 mx-auto mb-2" /><p className="text-zinc-500 text-xs">フォーカスフレーム</p></div>
        </div>
        <div className="absolute inset-8 border-2 border-amber-400/50 rounded-sm pointer-events-none">
          <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="w-6 h-6 border border-amber-400/60 rounded-full" /></div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
          <div className="bg-black/60 rounded px-2 py-1"><span className="text-amber-400 font-bold text-sm">{dist.toFixed(1)}m</span></div>
          <div className="bg-black/60 rounded px-2 py-1 text-right"><span className="text-zinc-300 text-[10px]">{focal}mm f/{ap}</span></div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-400 flex items-center gap-1"><Ruler className="w-3.5 h-3.5" />撮影距離</span>
          <span className="text-lg font-bold text-amber-400">{dist.toFixed(1)}m</span>
        </div>
        <input type="range" min={0.2} max={20} step={0.1} value={dist} onChange={e => setDist(parseFloat(e.target.value))} className="w-full" />
        <div className="flex justify-between text-[10px] text-zinc-600 mt-1"><span>0.2m</span><span>5m</span><span>10m</span><span>20m</span></div>
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1">{DIST_PRESETS.map(d => (
          <button key={d.v} onClick={() => setDist(d.v)} className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${Math.abs(dist-d.v)<0.15 ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>{d.l}</button>
        ))}</div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-zinc-900 rounded-xl p-2.5 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block mb-1">焦点距離</span>
          <div className="flex gap-1">{FOCALS.map(f => (
            <button key={f.v} onClick={() => setFocal(f.v)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${focal===f.v ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>{f.l}</button>
          ))}</div>
        </div>
        <div className="flex-1 bg-zinc-900 rounded-xl p-2.5 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block mb-1">絞り</span>
          <select value={ap} onChange={e => setAp(parseFloat(e.target.value))} className="w-full bg-zinc-800 text-amber-400 text-sm font-bold rounded-lg px-2 py-1.5 border border-zinc-700">{F_STOPS.map(f=><option key={f} value={f}>f/{f}</option>)}</select>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
        <div className="flex items-center gap-1 mb-2"><Focus className="w-3.5 h-3.5 text-zinc-400" /><span className="text-xs text-zinc-400">被写界深度スケール</span></div>
        <div className="relative h-10 bg-zinc-800 rounded-lg overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-5 flex items-end px-2">{[0.5,1,2,5,10,20,50].map(d => (
            <span key={d} className="absolute text-[8px] text-zinc-500" style={{ left: `${logPos(d)}%` }}>{d}m</span>
          ))}</div>
          {dof.near > 0 && <div className="absolute top-2 h-4 flex items-center">
            <div className="h-full bg-amber-600/40 border border-amber-500/60 rounded-sm relative" style={{ left: `${logPos(dof.near)}%`, width: `${dof.far===Infinity ? 100-logPos(dof.near) : logPos(dof.far)-logPos(dof.near)}%` }} />
            <div className="absolute top-0 w-0.5 h-6 bg-white rounded-full -translate-x-1/2" style={{ left: `${logPos(dist)}%` }} />
          </div>}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
        <div className="grid grid-cols-2 gap-3">
          <div><div className="text-[10px] text-zinc-500">手前</div><div className="text-sm font-bold text-zinc-200">{dof.near.toFixed(2)}m</div></div>
          <div><div className="text-[10px] text-zinc-500">奥行き</div><div className="text-sm font-bold text-zinc-200">{dof.far===Infinity?'∞':`${dof.far.toFixed(2)}m`}</div></div>
          <div><div className="text-[10px] text-zinc-500">総被写界深度</div><div className="text-sm font-bold text-amber-400">{dof.dof===Infinity?'∞':`${dof.dof.toFixed(2)}m`}</div></div>
          <div><div className="text-[10px] text-zinc-500">超焦点距離</div><div className="text-sm font-bold text-amber-400">{dof.hyperfocal.toFixed(1)}m</div></div>
        </div>
      </div>

      <div className={`rounded-xl p-3 border ${1/focal>1/60?'bg-red-900/20 border-red-800/50':'bg-zinc-900 border-zinc-800'}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">手ブレ限界</span>
          <span className={`text-sm font-bold ${1/focal>1/60?'text-red-400':'text-green-400'}`}>{focal}mm → 1/{Math.max(1,Math.round(1/hsLimit))}秒以下</span>
        </div>
      </div>
    </div>
  );
}