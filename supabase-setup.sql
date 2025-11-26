-- ========================================
-- ELM Clinic Survey - Supabase初期セットアップ
-- ========================================
-- このファイルをSupabaseのSQL Editorで実行してください
-- 
-- 手順：
-- 1. Supabaseダッシュボードにログイン
-- 2. 左メニューから「SQL Editor」を選択
-- 3. 「New query」をクリック
-- 4. このファイルの内容をコピー＆ペースト
-- 5. 「Run」ボタンをクリック
-- ========================================

-- ========================================
-- ステップ1: テーブルが存在しない場合は作成
-- ========================================

-- Clinic テーブル
CREATE TABLE IF NOT EXISTS "Clinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "google_review_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Doctor テーブル
CREATE TABLE IF NOT EXISTS "Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Doctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Survey テーブル
CREATE TABLE IF NOT EXISTS "Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "treatmentDate" TIMESTAMP(3) NOT NULL,
    "treatmentMenu" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "satisfaction" TEXT NOT NULL,
    "resultSatisfaction" TEXT,
    "counselingSatisfaction" TEXT,
    "atmosphereRating" TEXT,
    "staffServiceRating" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Survey_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Survey_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AdminUser テーブル
CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS "Doctor_clinicId_idx" ON "Doctor"("clinicId");
CREATE INDEX IF NOT EXISTS "Survey_clinicId_idx" ON "Survey"("clinicId");
CREATE INDEX IF NOT EXISTS "Survey_doctorId_idx" ON "Survey"("doctorId");
CREATE INDEX IF NOT EXISTS "Survey_treatmentDate_idx" ON "Survey"("treatmentDate");
CREATE INDEX IF NOT EXISTS "Survey_satisfaction_idx" ON "Survey"("satisfaction");

-- ========================================
-- ステップ2: 既存データをクリア（必要に応じて）
-- ========================================
-- 注意: 既存データがある場合は、以下のコメントを外して実行してください
-- TRUNCATE TABLE "Survey" CASCADE;
-- TRUNCATE TABLE "Doctor" CASCADE;
-- TRUNCATE TABLE "Clinic" CASCADE;

-- ========================================
-- ステップ3: 初期データ投入
-- ========================================

-- 広島院
DO $$
DECLARE
    hiroshima_id TEXT;
BEGIN
    -- 既に存在するかチェック
    SELECT "id" INTO hiroshima_id FROM "Clinic" WHERE "name" = '広島院' LIMIT 1;
    
    IF hiroshima_id IS NULL THEN
        INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
        VALUES (uuid_generate_v4()::text, '広島院', 'https://g.page/elmclinic-hiroshima/review', NOW(), NOW())
        RETURNING "id" INTO hiroshima_id;
    END IF;
END $$;

-- 広島院の先生
DO $$
DECLARE
    hiroshima_id TEXT;
BEGIN
    SELECT "id" INTO hiroshima_id FROM "Clinic" WHERE "name" = '広島院' LIMIT 1;
    
    IF hiroshima_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, hiroshima_id, '相原先生', NOW(), NOW()),
            (gen_random_uuid()::text, hiroshima_id, '松本院長', NOW(), NOW()),
            (gen_random_uuid()::text, hiroshima_id, '花ノ木先生', NOW(), NOW()),
            (gen_random_uuid()::text, hiroshima_id, '高木先生', NOW(), NOW()),
            (gen_random_uuid()::text, hiroshima_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 福岡院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '福岡院', 'https://g.page/elmclinic-fukuoka/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    fukuoka_id TEXT;
BEGIN
    SELECT "id" INTO fukuoka_id FROM "Clinic" WHERE "name" = '福岡院' LIMIT 1;
    
    IF fukuoka_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, fukuoka_id, '菊池院長', NOW(), NOW()),
            (gen_random_uuid()::text, fukuoka_id, '白水先生', NOW(), NOW()),
            (gen_random_uuid()::text, fukuoka_id, '早川先生', NOW(), NOW()),
            (gen_random_uuid()::text, fukuoka_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 岡山院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '岡山院', 'https://g.page/elmclinic-okayama/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    okayama_id TEXT;
BEGIN
    SELECT "id" INTO okayama_id FROM "Clinic" WHERE "name" = '岡山院' LIMIT 1;
    
    IF okayama_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, okayama_id, '高橋院長', NOW(), NOW()),
            (gen_random_uuid()::text, okayama_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 京都院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '京都院', 'https://g.page/elmclinic-kyoto/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    kyoto_id TEXT;
BEGIN
    SELECT "id" INTO kyoto_id FROM "Clinic" WHERE "name" = '京都院' LIMIT 1;
    
    IF kyoto_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, kyoto_id, '内山院長', NOW(), NOW()),
            (gen_random_uuid()::text, kyoto_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 熊本院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '熊本院', 'https://g.page/elmclinic-kumamoto/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    kumamoto_id TEXT;
BEGIN
    SELECT "id" INTO kumamoto_id FROM "Clinic" WHERE "name" = '熊本院' LIMIT 1;
    
    IF kumamoto_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, kumamoto_id, '佐古院長', NOW(), NOW()),
            (gen_random_uuid()::text, kumamoto_id, '境先生', NOW(), NOW()),
            (gen_random_uuid()::text, kumamoto_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 大阪院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '大阪院', 'https://g.page/elmclinic-osaka/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    osaka_id TEXT;
BEGIN
    SELECT "id" INTO osaka_id FROM "Clinic" WHERE "name" = '大阪院' LIMIT 1;
    
    IF osaka_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, osaka_id, '佐藤院長', NOW(), NOW()),
            (gen_random_uuid()::text, osaka_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 神戸院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '神戸院', 'https://g.page/elmclinic-kobe/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    kobe_id TEXT;
BEGIN
    SELECT "id" INTO kobe_id FROM "Clinic" WHERE "name" = '神戸院' LIMIT 1;
    
    IF kobe_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, kobe_id, '七里院長', NOW(), NOW()),
            (gen_random_uuid()::text, kobe_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 表参道院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '表参道院', 'https://g.page/elmclinic-omotesando/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    omotesando_id TEXT;
BEGIN
    SELECT "id" INTO omotesando_id FROM "Clinic" WHERE "name" = '表参道院' LIMIT 1;
    
    IF omotesando_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, omotesando_id, '土井院長', NOW(), NOW()),
            (gen_random_uuid()::text, omotesando_id, '藤内先生', NOW(), NOW()),
            (gen_random_uuid()::text, omotesando_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 麻布院
INSERT INTO "Clinic" ("id", "name", "google_review_url", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, '麻布院', 'https://g.page/elmclinic-azabu/review', NOW(), NOW())
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    azabu_id TEXT;
BEGIN
    SELECT "id" INTO azabu_id FROM "Clinic" WHERE "name" = '麻布院' LIMIT 1;
    
    IF azabu_id IS NOT NULL THEN
        INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid()::text, azabu_id, '先生', NOW(), NOW()),
            (gen_random_uuid()::text, azabu_id, '看護師', NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ========================================
-- 完了メッセージ
-- ========================================
SELECT 'Initial data setup completed successfully!' AS message;

