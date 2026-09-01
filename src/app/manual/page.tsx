'use client';

import { ArrowLeft, Sun, Ruler, Camera, Moon, Film, Zap, Focus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function Section({ title, icon: Icon, children, defaultOpen = false }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 text-left">
        <Icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <span className="text-sm font-bold text-zinc-100 flex-1">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 p-3 bg-amber-600/10 border border-amber-600/30 rounded-lg">
      <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-200/90 leading-relaxed">{children}</p>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</div>
      <p className="text-xs text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

export default function ManualPage() {
  return (
    <div className="max-w-lg mx-auto h-full flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <a href="/film-mate/" className="p-1 -ml-1 rounded-lg hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-300" />
        </a>
        <div>
          <h1 className="text-base font-bold text-zinc-100">使い方ガイド</h1>
          <p className="text-[10px] text-zinc-500">Film Mate - フィルムカメラ用 露出計 ＆ 距離計</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-3 pb-8">
        <div className="bg-gradient-to-br from-amber-600/20 to-zinc-900 rounded-xl p-4 border border-amber-600/30">
          <h2 className="text-sm font-bold text-amber-400 mb-2">Film Mate とは？</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            フィルムカメラ撮影をサポートするスマートフォンアプリです。
            カメラで光を測って適正露出を計算する「露出計」と、
            ピント合わせに役立つ「距離計」の2つの機能があります。
          </p>
        </div>

        <Section title="露出計の使い方" icon={Sun} defaultOpen={true}>
          <p className="text-xs text-zinc-400 leading-relaxed">
            露出計は、被写体の明るさを測ってシャッタースピードと絞りの組み合わせを計算します。
            3つの測光モードから選べます。
          </p>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 mb-2">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              カメラ測光モード
            </h3>
            <div className="space-y-2">
              <Step n={1}>「測光スタート」ボタンを押すとカメラが起動します。</Step>
              <Step n={2}>画面中央の枠を被写体に向けて光を測ります。EV値がリアルタイムに表示されます。</Step>
              <Step n={3}>測り終わったら「停止」ボタンを押します（最後のEV値は残ります）。</Step>
            </div>
            <Tip>画面全体の平均輝度で測光しています。被写体に近づいて測るか、シーンプリセットと組み合わせると精度が上がります。</Tip>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 mb-2">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              シーンプリセットモード
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              晴れ・曇り・室内・夕焼け・夜景など、11種類のシーンから選ぶと、
              その状況に対応するEV値が即座に設定されます。カメラが使えない場面や、
              参考値として手軽に使いたいときに便利です。
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 mb-2">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              フィルムプリセットモード
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              使用するフィルムを選ぶと、そのフィルムのISO感度が自動設定されます。
              Portra、Ektar、HP5+ など15種類の人気フィルムに対応しています。
            </p>
          </div>
        </Section>

        <Section title="ISO・絞り・露出補正" icon={Zap}>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 mb-1.5">ISO感度</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              ドロップダウンからISO 25 ～ 3200まで選択できます。
              フィルムプリセットを使うと自動で設定されますが、
              増感・減感現像をする場合は手動で変更してください。
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 mb-1.5">絞り（F値）</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              希望する絞り値を選ぶと、テーブル内でその絞りに対応するシャッタースピードがハイライトされます。
              被写界深度を考慮して絞りを決める際に参考にしてください。
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 mb-1.5">露出補正</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              -3 ～ +3 EVの範囲で補正できます。0.5EVステップで微調整可能です。
              白い被写体（雪景色など）は +1 ～ +1.5、
              黒い被写体は -0.5 ～ -1 が目安です。
            </p>
          </div>
        </Section>

        <Section title="等価露出テーブルの読み方" icon={Sun}>
          <p className="text-xs text-zinc-300 leading-relaxed">
            測光結果をもとに、すべての絞り値に対するシャッタースピードの一覧が表示されます。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-700">
                  <th className="py-1.5 text-left font-bold">列の意味</th>
                  <th className="py-1.5 text-left font-bold">説明</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800"><td className="py-1.5 text-amber-400 font-bold">F値</td><td className="py-1.5">絞りの値（f/1.4 ～ f/32）</td></tr>
                <tr className="border-b border-zinc-800"><td className="py-1.5 text-amber-400 font-bold">シャッター</td><td className="py-1.5">対応するシャッタースピード</td></tr>
                <tr className="border-b border-zinc-800"><td className="py-1.5 text-amber-400 font-bold">偏差</td><td className="py-1.5">◎ = ピッタリ、○ = 誤差0.5EV以内</td></tr>
                <tr><td className="py-1.5 text-amber-400 font-bold">EV</td><td className="py-1.5">その組み合わせの実際のEV値</td></tr>
              </tbody>
            </table>
          </div>
          <Tip>アンバー色にハイライトされた行が、選択した絞りに最も近い組み合わせです。◎マークが付いている行は誤差なしのピッタリ設定です。</Tip>
        </Section>

        <Section title="距離計の使い方" icon={Ruler}>
          <p className="text-xs text-zinc-400 leading-relaxed">
            距離計は、被写界深度（ピントが合って見える範囲）を計算します。
            マニュアルフォーカスのレンズを使うときに便利です。
          </p>
          <div className="space-y-2">
            <Step n={1}>撮影距離をスライダーで設定します。0.3m ～ 20mの範囲で、プリセットボタンも使えます。</Step>
            <Step n={2}>レンズの焦点距離（28/35/50/85mm）を選びます。</Step>
            <Step n={3}>絞り値を選ぶと、被写界深度が自動計算されます。</Step>
          </div>
          <div className="mt-2">
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 mb-1.5">
              <Focus className="w-3.5 h-3.5 text-amber-400" />
              被写界深度スケール
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              オレンジ色の帯がピントが合う範囲を表します。
              白い線が合焦位置（設定した距離）です。
              帯が広いほど「パンフォーカス」に近く、
              帯が狭いほど「ボケ」を活かした撮影ができます。
            </p>
          </div>
          <div className="mt-2">
            <h3 className="text-xs font-bold text-zinc-200 mb-1.5">数値の読み方</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-zinc-800 rounded-lg"><span className="text-zinc-400">手前</span><br /><span className="text-zinc-200 font-bold">ピントの合う最短距離</span></div>
              <div className="p-2 bg-zinc-800 rounded-lg"><span className="text-zinc-400">奥行き</span><br /><span className="text-zinc-200 font-bold">ピントの合う最遠距離（∞＝無限遠）</span></div>
              <div className="p-2 bg-zinc-800 rounded-lg"><span className="text-amber-400">総被写界深度</span><br /><span className="text-zinc-200 font-bold">手前～奥行きの幅</span></div>
              <div className="p-2 bg-zinc-800 rounded-lg"><span className="text-amber-400">超焦点距離</span><br /><span className="text-zinc-200 font-bold">ここに合わせると∞まで合焦</span></div>
            </div>
          </div>
          <Tip>超焦点距離より手前にピントを合わせると、手前から無限遠まですべてにピントが合います（パンフォーカス）。スナップ撮影に最適です。</Tip>
        </Section>

        <Section title="実践撮影ワークフロー" icon={Camera}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-amber-400 mb-1.5">スナップ撮影（街角）</h3>
              <ol className="text-xs text-zinc-300 leading-relaxed space-y-1 list-decimal list-inside">
                <li>距離計で焦点距離35mm・f/8 ～ f/11に設定</li>
                <li>超焦点距離を確認し、その距離にピントを合わせる</li>
                <li>露出計でEVを測り、シャッタースピードを確認</li>
                <li>ピント合わせを気にせず撮影！</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-400 mb-1.5">ポートレート</h3>
              <ol className="text-xs text-zinc-300 leading-relaxed space-y-1 list-decimal list-inside">
                <li>距離計で焦点距離85mm・f/2 ～ f/2.8に設定</li>
                <li>被写体までの距離をスライダーで入力</li>
                <li>被写界深度を確認（狭いほど背景がボケる）</li>
                <li>露出計で適正露出を測定</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-400 mb-1.5">夜景撮影</h3>
              <ol className="text-xs text-zinc-300 leading-relaxed space-y-1 list-decimal list-inside">
                <li>シーンプリセットで「夜景」を選択（EV 3）</li>
                <li>ISO 400のフィルムの場合、f/2 で1/4秒程度</li>
                <li>三脚が必要なシャッタースピードか確認</li>
                <li>距離計でピント位置を正確に設定</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-400 mb-1.5">風景写真</h3>
              <ol className="text-xs text-zinc-300 leading-relaxed space-y-1 list-decimal list-inside">
                <li>露出計のカメラモードで空の明るさを測る</li>
                <li>距離計で焦点距離28mm・f/11に設定</li>
                <li>超焦点距離にピントを合わせてパンフォーカスに</li>
                <li>手ブレ限界より速いシャッタースピードを選ぶ</li>
              </ol>
            </div>
          </div>
        </Section>

        <Section title="注意点・コツ" icon={Zap}>
          <ul className="text-xs text-zinc-300 leading-relaxed space-y-2">
            <li className="flex gap-2"><span className="text-amber-400 font-bold">&#8226;</span>スマホカメラの測光は参考値です。重要な撮影では別の露出計と併用することをおすすめします。</li>
            <li className="flex gap-2"><span className="text-amber-400 font-bold">&#8226;</span>被写界深度の計算は「錯乱円 0.03mm」で計算しています。拡大サイズによっては実際と異なる場合があります。</li>
            <li className="flex gap-2"><span className="text-amber-400 font-bold">&#8226;</span>フィルムの現像引き伸ばしを考えると、絞りを1段絞る（f/8 → f/11など）のが安全です。</li>
            <li className="flex gap-2"><span className="text-amber-400 font-bold">&#8226;</span>手ブレ限界表示を確認して、三脚が必要か判断してください。</li>
            <li className="flex gap-2"><span className="text-amber-400 font-bold">&#8226;</span>逆光時は +1.5 ～ +2 EV の補正が目安です。</li>
          </ul>
        </Section>

        <div className="text-center pt-2 pb-4">
          <p className="text-[10px] text-zinc-600">Film Mate v1.0 — フィルム写真を楽しもう</p>
        </div>
      </main>
    </div>
  );
}
