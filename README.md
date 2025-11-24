# BlueFrame Studio - 企業サイト

映像制作・コンテンツマーケティングサービスを提供するBlueFrame Studioの企業サイトです。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React

## 特徴

- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- 日本企業向けのデザインとコンテンツ
- スムーズなアニメーション効果
- アクセシビリティ対応
- SEO最適化

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 開発サーバーの起動
```bash
npm run dev
```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構造

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Works.tsx
│   ├── Philosophy.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── public/
└── 設定ファイル
```

## ページ構成

1. **ヘッダー**: ナビゲーションメニュー（モバイル対応）
2. **ヒーローセクション**: メインビジュアルとCTA
3. **サービス紹介**: 4つの主要サービスをカード形式で表示
4. **制作事例**: 実績をグリッドレイアウトで表示
5. **会社理念**: 企業の価値観とミッション
6. **お問い合わせ**: フォームと連絡先情報
7. **フッター**: 会社情報とソーシャルリンク

## カスタマイズ

- 色の変更: `tailwind.config.js` の `colors` セクション
- コンテンツの変更: 各コンポーネントファイル内のテキスト
- 画像の変更: `public/` フォルダに画像を配置し、パスを更新

## デプロイ

Vercel、Netlify、その他の静的サイトホスティングサービスでデプロイ可能です。

```bash
npm run build
```

