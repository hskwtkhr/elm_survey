# エルムクリニック アンケートサイト

施術後のアンケートを収集し、満足度に応じてGoogle口コミ投稿を誘導するシステムです。

## 機能

- 1問1答形式のアンケートフォーム
- 院名選択に応じた動的な先生名選択
- 満足度に応じたGoogle口コミ生成（AI生成）
- 管理者用ダッシュボード（集計、フィルタリング、CSVエクスポート）
- アンケート内容の編集・削除機能

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **グラフ**: Recharts
- **AI**: Google Generative Language API

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/elm_survey?schema=public"

# Google AI API
GOOGLE_AI_API_KEY="your-google-ai-api-key-here"

# Application URL (for production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. データベースのセットアップ

```bash
# Prismaマイグレーション
npx prisma migrate dev

# 初期データの投入
npm run db:seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## デプロイ

### Vercel + Supabase

1. **Supabaseプロジェクトの作成**
   - [Supabase](https://supabase.com)でプロジェクトを作成
   - データベース接続URLを取得

2. **Vercelへのデプロイ**
   - [Vercel](https://vercel.com)にプロジェクトをインポート
   - 環境変数を設定：
     - `DATABASE_URL`: Supabaseの接続URL
     - `GOOGLE_AI_API_KEY`: Google AI APIキー
     - `NEXT_PUBLIC_APP_URL`: VercelのデプロイURL

3. **データベースマイグレーション**
   - Vercelのデプロイ後、Prismaマイグレーションを実行
   - 初期データを投入

### 管理者アカウントの作成

データベースに直接管理者アカウントを作成するか、シードスクリプトを拡張してください。

```typescript
// prisma/seed.ts に追加
await prisma.adminUser.create({
  data: {
    username: 'admin',
    passwordHash: await hashPassword('your-password'),
  },
})
```

## プロジェクト構造

```
elm_survey/
├── app/
│   ├── (public)/          # 公開ページ
│   │   ├── page.tsx       # アンケートフォーム
│   │   ├── complete/      # 完了ページ
│   │   └── review/        # 口コミ生成ページ
│   ├── (admin)/           # 管理者ページ
│   │   ├── login/         # ログインページ
│   │   └── dashboard/     # ダッシュボード
│   └── api/               # API Routes
├── components/            # Reactコンポーネント
├── lib/                   # ユーティリティ
├── prisma/                # Prismaスキーマとシード
└── public/                # 静的ファイル
```

## ライセンス

このプロジェクトはプライベートプロジェクトです。
