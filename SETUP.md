# BlueFrame Studio ウェブサイト - セットアップガイド

## 前提条件

このプロジェクトを実行するには、以下のソフトウェアが必要です：

### 1. Node.js のインストール

**macOS (Homebrew を使用):**
```bash
brew install node
```

**macOS (公式インストーラー):**
1. [Node.js 公式サイト](https://nodejs.org/) から LTS 版をダウンロード
2. インストーラーを実行

**Windows:**
1. [Node.js 公式サイト](https://nodejs.org/) から LTS 版をダウンロード
2. インストーラーを実行

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. インストール確認

```bash
node --version
npm --version
```

## プロジェクトのセットアップ

### 1. 依存関係のインストール

```bash
cd /Users/gaohang/Documents/BMHP/2版
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. ブラウザで確認

[http://localhost:3000](http://localhost:3000) を開いてウェブサイトを確認

## 利用可能なコマンド

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルドを作成
- `npm run start` - 本番サーバーを起動
- `npm run lint` - コードのリントを実行

## トラブルシューティング

### Node.js がインストールされていない場合

1. 上記の手順に従って Node.js をインストール
2. ターミナルを再起動
3. `node --version` でインストールを確認

### 依存関係のインストールでエラーが発生する場合

```bash
# npm キャッシュをクリア
npm cache clean --force

# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ポート 3000 が使用中の場合

```bash
# 別のポートで起動
npm run dev -- -p 3001
```

## デプロイ

### Vercel でのデプロイ

1. [Vercel](https://vercel.com/) にアカウント作成
2. GitHub リポジトリと連携
3. 自動デプロイ設定

### Netlify でのデプロイ

1. [Netlify](https://netlify.com/) にアカウント作成
2. プロジェクトフォルダをドラッグ&ドロップ
3. ビルドコマンド: `npm run build`
4. 公開フォルダ: `.next`

## カスタマイズ

### 会社情報の変更

各コンポーネントファイル内の以下の情報を更新：

- 会社名: `components/Header.tsx`, `components/Footer.tsx`
- 連絡先: `components/Contact.tsx`, `components/Footer.tsx`
- サービス内容: `components/Services.tsx`
- 制作事例: `components/Works.tsx`

### 色の変更

`tailwind.config.js` の `colors` セクションを編集：

```javascript
colors: {
  'navy': {
    // 色の定義を変更
  }
}
```

### 画像の変更

1. `public/` フォルダに画像を配置
2. コンポーネント内の画像パスを更新

## サポート

技術的な問題が発生した場合は、以下を確認してください：

1. Node.js のバージョン（推奨: 18.x 以上）
2. 依存関係のインストール状況
3. ポートの使用状況
4. ブラウザのコンソールエラー

