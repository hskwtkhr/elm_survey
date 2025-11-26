-- 初期データ投入
-- テーブル作成後に実行してください

-- 既存データをクリア（初回のみ、既にデータがある場合はスキップ）
-- TRUNCATE TABLE "Survey" CASCADE;
-- TRUNCATE TABLE "Doctor" CASCADE;
-- TRUNCATE TABLE "Clinic" CASCADE;

-- 広島院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('広島院', 'https://g.page/elmclinic-hiroshima/review', NOW(), NOW());

-- 広島院の先生
DO $$
DECLARE
    hiroshima_id TEXT;
BEGIN
    SELECT "id" INTO hiroshima_id FROM "Clinic" WHERE "name" = '広島院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (hiroshima_id, '相原先生', NOW(), NOW()),
        (hiroshima_id, '松本先生', NOW(), NOW()),
        (hiroshima_id, '花ノ木先生', NOW(), NOW()),
        (hiroshima_id, '高木先生', NOW(), NOW()),
        (hiroshima_id, '看護師', NOW(), NOW());
END $$;

-- 岡山院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('岡山院', 'https://g.page/elmclinic-okayama/review', NOW(), NOW());

DO $$
DECLARE
    okayama_id TEXT;
BEGIN
    SELECT "id" INTO okayama_id FROM "Clinic" WHERE "name" = '岡山院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (okayama_id, '高橋先生', NOW(), NOW()),
        (okayama_id, '看護師', NOW(), NOW());
END $$;

-- 福岡院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('福岡院', 'https://g.page/elmclinic-fukuoka/review', NOW(), NOW());

DO $$
DECLARE
    fukuoka_id TEXT;
BEGIN
    SELECT "id" INTO fukuoka_id FROM "Clinic" WHERE "name" = '福岡院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (fukuoka_id, 'ダミー先生1', NOW(), NOW()),
        (fukuoka_id, 'ダミー先生2', NOW(), NOW()),
        (fukuoka_id, '看護師', NOW(), NOW());
END $$;

-- 熊本院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('熊本院', 'https://g.page/elmclinic-kumamoto/review', NOW(), NOW());

DO $$
DECLARE
    kumamoto_id TEXT;
BEGIN
    SELECT "id" INTO kumamoto_id FROM "Clinic" WHERE "name" = '熊本院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (kumamoto_id, 'ダミー先生1', NOW(), NOW()),
        (kumamoto_id, 'ダミー先生2', NOW(), NOW()),
        (kumamoto_id, '看護師', NOW(), NOW());
END $$;

-- 神戸院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('神戸院', 'https://g.page/elmclinic-kobe/review', NOW(), NOW());

DO $$
DECLARE
    kobe_id TEXT;
BEGIN
    SELECT "id" INTO kobe_id FROM "Clinic" WHERE "name" = '神戸院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (kobe_id, 'ダミー先生1', NOW(), NOW()),
        (kobe_id, 'ダミー先生2', NOW(), NOW()),
        (kobe_id, '看護師', NOW(), NOW());
END $$;

-- 大阪院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('大阪院', 'https://g.page/elmclinic-osaka/review', NOW(), NOW());

DO $$
DECLARE
    osaka_id TEXT;
BEGIN
    SELECT "id" INTO osaka_id FROM "Clinic" WHERE "name" = '大阪院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (osaka_id, 'ダミー先生1', NOW(), NOW()),
        (osaka_id, 'ダミー先生2', NOW(), NOW()),
        (osaka_id, '看護師', NOW(), NOW());
END $$;

-- 京都院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('京都院', 'https://g.page/elmclinic-kyoto/review', NOW(), NOW());

DO $$
DECLARE
    kyoto_id TEXT;
BEGIN
    SELECT "id" INTO kyoto_id FROM "Clinic" WHERE "name" = '京都院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (kyoto_id, 'ダミー先生1', NOW(), NOW()),
        (kyoto_id, 'ダミー先生2', NOW(), NOW()),
        (kyoto_id, '看護師', NOW(), NOW());
END $$;

-- 表参道院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('表参道院', 'https://g.page/elmclinic-omotesando/review', NOW(), NOW());

DO $$
DECLARE
    omotesando_id TEXT;
BEGIN
    SELECT "id" INTO omotesando_id FROM "Clinic" WHERE "name" = '表参道院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (omotesando_id, 'ダミー先生1', NOW(), NOW()),
        (omotesando_id, 'ダミー先生2', NOW(), NOW()),
        (omotesando_id, '看護師', NOW(), NOW());
END $$;

-- 麻布院
INSERT INTO "Clinic" ("name", "google_review_url", "createdAt", "updatedAt") 
VALUES ('麻布院', 'https://g.page/elmclinic-azabu/review', NOW(), NOW());

DO $$
DECLARE
    azabu_id TEXT;
BEGIN
    SELECT "id" INTO azabu_id FROM "Clinic" WHERE "name" = '麻布院' ORDER BY "createdAt" DESC LIMIT 1;
    
    INSERT INTO "Doctor" ("clinicId", "name", "createdAt", "updatedAt")
    VALUES 
        (azabu_id, 'ダミー先生1', NOW(), NOW()),
        (azabu_id, 'ダミー先生2', NOW(), NOW()),
        (azabu_id, '看護師', NOW(), NOW());
END $$;
