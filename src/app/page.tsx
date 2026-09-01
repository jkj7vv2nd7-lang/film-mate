'use client';

import { useState } from 'react';
import { Sun, Ruler, HelpCircle } from 'lucide-react';
import ExposureMeter from '@/components/ExposureMeter';
import DistanceMeter from '@/components/DistanceMeter';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'exposure' | 'distance'>('exposure');
  const [info, setInfo] = useState({ ev: 0, f: 5.6, t: '---', iso: 400 });

  return (
    <div id="app-root" className="max-w-lg mx-auto">
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div>
          <h1 className="text-base font-bold text-zinc-100">Film Mate</h1>
          <p className="text-[10px] text-zinc-500">フィルムカメラ用 露出計 ＆ 距離計</p>
        </div>
                <a href="/film-mate/manual" className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
          <HelpCircle className="w-5 h-5 text-zinc-400" />
        </a>
      </header>
      <div className="flex border-b border-zinc-800">
        <button onClick={() => setActiveTab('exposure')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${activeTab === 'exposure' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-zinc-500'}`}>
          <Sun className="w-4 h-4" />露出計
        </button>
        <button onClick={() => setActiveTab('distance')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${activeTab === 'distance' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-zinc-500'}`}>
          <Ruler className="w-4 h-4" />距離計
        </button>
      </div>
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'exposure' ? (
          <ExposureMeter onEVChange={(ev, f, t, iso) => setInfo({ ev, f, t, iso })} />
        ) : (
          <DistanceMeter />
        )}
      </main>
      <div className="flex items-center justify-around px-3 py-2.5 bg-zinc-900/95 border-t border-zinc-800">
        <div className="text-center"><div className="text-[9px] text-zinc-500">EV</div><div className="text-xs font-bold text-amber-400">{info.ev || '---'}</div></div>
        <div className="text-center"><div className="text-[9px] text-zinc-500">絞り</div><div className="text-xs font-bold text-zinc-200">f/{info.f}</div></div>
        <div className="text-center"><div className="text-[9px] text-zinc-500">シャッター</div><div className="text-xs font-bold text-zinc-200">{info.t}</div></div>
        <div className="text-center"><div className="text-[9px] text-zinc-500">ISO</div><div className="text-xs font-bold text-zinc-200">{info.iso}</div></div>
      </div>
    </div>
  );
}
