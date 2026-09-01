# Film Mate

フィルムカメラ用の露出計＆距離計スマホアプリです。

## 特徴

### 露出計（Light Meter）
- 測光値に基づく適正露出の計算
- 絞り値（F値）・シャッタースピード・ISO感度の組み合わせを即座に表示

### 距離計（Depth of Field Calculator）
- 被写界深度の計算
- ピント合わせの参考にする被写界深度表を表示

## 使い方

```bash
# インストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## 技術スタック

- **Next.js 15** — React フレームワーク
- **React 19** — UI ライブラリ
- **TypeScript** — 型安全な開発
- **Tailwind CSS 4** — ユーティリティファーストCSS
- **Lucide React** — アイコンライブラリ

## 計算式

### 露出値（EV）

```
EV = log₂(N² / t)
```

- `N` = 絞り値（F値）
- `t` = 露出時間（秒）

### 被写界深度（DOF）

```
Dn = N · c · s² / (f² + N · c · s)
Df = N · c · s² / (f² - N · c · s)
DOF = Df - Dn
```

- `N` = 絞り値
- `c` = 許容錯乱円径
- `s` = 被写体距離
- `f` = レンズ焦点距離
- `Dn` = 手前の被写界深度限界
- `Df` = 奥の被写界深度限界

## ライセンス

MIT License