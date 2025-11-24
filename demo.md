# BlueFrame Studio ウェブサイト - デモガイド

## プロジェクト概要

このプロジェクトは、映像制作・コンテンツマーケティングサービスを提供するBlueFrame Studioの企業サイトです。参考サイト（https://www.nihonzaitaku.co.jp/kanri/）のデザインスタイルを参考に、日本企業向けのプロフェッショナルなウェブサイトを構築しました。

## 主な特徴

### 🎨 デザイン
- **日本企業スタイル**: 信頼感とプロフェッショナル感を重視
- **カラーパレット**: 白 + ネイビーブルー + グレー
- **フォント**: Noto Sans JP（日本語対応）
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応

### ⚡ 技術仕様
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React

### 📱 ページ構成
1. **ヘッダー**: 固定ナビゲーション（モバイルメニュー対応）
2. **ヒーロー**: メインビジュアル + CTA
3. **サービス**: 4つの主要サービスをカード表示
4. **制作事例**: 実績をグリッドレイアウトで表示
5. **会社理念**: 企業価値観とミッション
6. **お問い合わせ**: フォーム + 連絡先情報
7. **フッター**: 会社情報 + ソーシャルリンク

## クイックスタート

### 1. 環境準備
```bash
# Node.js をインストール（未インストールの場合）
# macOS
brew install node

# または公式サイトからダウンロード
# https://nodejs.org/
```

### 2. プロジェクト実行
```bash
# プロジェクトディレクトリに移動
cd /Users/gaohang/Documents/BMHP/2版

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 3. ブラウザで確認
[http://localhost:3000](http://localhost:3000) を開く

## カスタマイズポイント

### 会社情報の変更
- **会社名**: `components/Header.tsx` の "BlueFrame Studio"
- **連絡先**: `components/Contact.tsx` と `components/Footer.tsx`
- **住所**: `components/Footer.tsx` の所在地情報

### サービス内容の変更
`components/Services.tsx` の `services` 配列を編集：

```typescript
const services = [
  {
    icon: Video,
    title: '企業映像制作',
    description: '...',
    features: ['...']
  },
  // 他のサービス...
]
```

### 制作事例の変更
`components/Works.tsx` の `works` 配列を編集：

```typescript
const works = [
  {
    id: 1,
    title: 'プロジェクト名',
    client: 'クライアント名',
    category: 'カテゴリ',
    image: '画像URL',
    description: '説明文'
  },
  // 他の事例...
]
```

### 色の変更
`tailwind.config.js` の `colors` セクションを編集：

```javascript
colors: {
  'navy': {
    50: '#f0f4f8',
    // 色の定義を変更
  }
}
```

## デプロイオプション

### Vercel（推奨）
1. [Vercel](https://vercel.com/) にアカウント作成
2. GitHub リポジトリと連携
3. 自動デプロイ

### Netlify
1. [Netlify](https://netlify.com/) にアカウント作成
2. プロジェクトフォルダをドラッグ&ドロップ
3. ビルドコマンド: `npm run build`
4. 公開フォルダ: `.next`

### その他のホスティング
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages

## パフォーマンス最適化

- 画像最適化（Next.js Image コンポーネント使用）
- コード分割（Next.js 自動対応）
- 遅延読み込み（Framer Motion の useInView 使用）
- SEO最適化（メタタグ設定済み）

## ブラウザサポート

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## トラブルシューティング

### よくある問題

**1. Node.js がインストールされていない**
```bash
# インストール確認
node --version
npm --version

# インストール（macOS）
brew install node
```

**2. 依存関係のインストールエラー**
```bash
# キャッシュクリア
npm cache clean --force

# 再インストール
rm -rf node_modules package-lock.json
npm install
```

**3. ポート 3000 が使用中**
```bash
# 別のポートで起動
npm run dev -- -p 3001
```

## サポート

技術的な問題が発生した場合は、以下を確認してください：

1. Node.js のバージョン（推奨: 18.x 以上）
2. 依存関係のインストール状況
3. ブラウザのコンソールエラー
4. ネットワーク接続状況

