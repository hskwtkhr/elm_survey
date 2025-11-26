# Vercelデプロイ後のセットアップ手順

## 1. データベース初期化（Supabase SQL Editorで実行）

1. [Supabase Dashboard](https://supabase.com/dashboard)にログイン
2. プロジェクトを選択
3. 左メニューから「SQL Editor」をクリック
4. 「New query」をクリック
5. `supabase-setup.sql`ファイルの内容をコピーして貼り付け
6. 「Run」ボタンをクリックして実行

これで、テーブル作成と初期データ投入が完了します。

## 2. 管理者アカウントの作成

Supabase SQL Editorで以下のSQLを実行してください：

```sql
-- パスワードハッシュを生成する必要があります
-- パスワード: admin123 の場合のハッシュ（bcryptjsで生成）
-- 以下のコマンドをローカルで実行してハッシュを取得してください：
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h))"

INSERT INTO "AdminUser" ("id", "username", "passwordHash", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin',
  '$2a$10$YourPasswordHashHere',  -- 上記で生成したハッシュに置き換えてください
  NOW(),
  NOW()
)
ON CONFLICT ("username") DO NOTHING;
```

または、ローカル環境で管理者を作成：

```bash
npm run create-admin
```

## 3. 動作確認

1. サイトにアクセス: `https://your-vercel-app.vercel.app`
2. アンケートフォームで院情報が表示されることを確認
3. 管理者ダッシュボード: `https://your-vercel-app.vercel.app/login`
   - ユーザー名: `admin`
   - パスワード: `admin123`（または設定したパスワード）

## トラブルシューティング

### 院情報が表示されない場合

1. Supabase SQL Editorで以下のクエリを実行して、データが投入されているか確認：

```sql
SELECT * FROM "Clinic";
SELECT * FROM "Doctor";
```

2. Vercelの環境変数 `DATABASE_URL` が正しく設定されているか確認

### エラーが発生する場合

1. Vercelのデプロイログを確認
2. Supabaseのログを確認（左メニュー > Logs）
3. ブラウザのコンソールでエラーを確認

