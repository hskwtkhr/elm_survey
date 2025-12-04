# データベース接続エラーの修正手順

## 問題
エラーメッセージ: `Authentication failed against database server` - データベース認証に失敗しています。

## 解決手順

### ステップ1: Supabaseで接続URLを取得

1. [Supabase Dashboard](https://supabase.com/dashboard)にログイン
2. プロジェクトを選択
3. 左メニューから「Project Settings」（⚙️アイコン）をクリック
4. 左メニューから「Database」を選択
5. 「Connection string」セクションを探す
6. **「Transaction pooler」**タブを選択
7. **「URI」**をコピー（`postgresql://postgres.vzkavfyxjwzifwsbghru:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres` のような形式）
8. `[YOUR-PASSWORD]`の部分を、Supabaseプロジェクトの実際のパスワードに置き換える
   - パスワードを忘れた場合は、「Reset database password」から再設定できます

### ステップ2: Vercelで環境変数を設定

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. `elm-survey`プロジェクトを選択
3. 上部のタブから「Settings」をクリック
4. 左メニューから「Environment Variables」を選択
5. 既存の`DATABASE_URL`を確認：
   - 存在する場合：「Edit」をクリック
   - 存在しない場合：「Add New」をクリック
6. 以下の情報を入力：
   - **Key**: `DATABASE_URL`
   - **Value**: ステップ1で取得した接続URL（パスワードを実際の値に置き換えたもの）
   - **Environment**: 「Production」「Preview」「Development」すべてにチェックを入れる
7. 「Save」をクリック

### ステップ3: 再デプロイ

1. Vercelダッシュボードに戻る
2. プロジェクトページで「Deployments」タブを選択
3. 最新のデプロイの右側にある「...」（三点メニュー）をクリック
4. 「Redeploy」を選択
5. 「Redeploy」ボタンをクリック

### ステップ4: 動作確認

デプロイ完了後（数分）：

1. `https://elm-survey.vercel.app/api/test-db` にアクセス
   - `{"success": true, ...}` が返れば成功
2. `https://elm-survey.vercel.app/api/clinics` にアクセス
   - 院のリスト（JSON配列）が返れば成功
3. `https://elm-survey.vercel.app` にアクセス
   - 院情報が表示されれば成功

## 接続URLの形式

正しい形式：
```
postgresql://postgres.vzkavfyxjwzifwsbghru:実際のパスワード@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

注意：
- `postgres.vzkavfyxjwzifwsbghru` の部分は、Supabaseプロジェクトによって異なります
- パスワードには特殊文字が含まれている場合、URLエンコードが必要な場合があります
- `?pgbouncer=true&sslmode=require` は重要です（接続プーラーを使用するため）

## トラブルシューティング

### まだエラーが出る場合

1. **パスワードに特殊文字が含まれている場合**:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `&` → `%26`
   - など、URLエンコードが必要です

2. **接続URLを再確認**:
   - Supabaseの「Database」> 「Connection string」で最新のURLを取得
   - 「Transaction pooler」を使用していることを確認

3. **環境変数の反映確認**:
   - Vercelで環境変数を設定した後、必ず再デプロイが必要です
   - 環境変数を変更しただけでは、実行中のデプロイには反映されません


