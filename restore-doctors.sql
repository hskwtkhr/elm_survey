-- ========================================
-- 削除された医師・看護師データを復元
-- ========================================
-- SupabaseのSQL Editorで実行してください
-- 注意：既存の医師データがある場合は、重複しないようにチェックしています

-- まず現在の状況を確認
SELECT '=== 現在の各院の医師数（復元前） ===' as info;
SELECT c.name as clinic_name, COUNT(d.id) as doctor_count
FROM "Clinic" c
LEFT JOIN "Doctor" d ON c.id = d."clinicId"
GROUP BY c.name
ORDER BY c.name;

-- 広島院の先生（念のため確認・復元）
DO $$
DECLARE
    hiroshima_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO hiroshima_id FROM "Clinic" WHERE "name" = '広島院' LIMIT 1;
    
    IF hiroshima_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = hiroshima_id;
        
        -- 広島院の医師が5人未満の場合、不足分を追加
        IF doctor_count < 5 THEN
            -- 既存の医師名を確認して、不足分のみ追加
            IF NOT EXISTS (SELECT 1 FROM "Doctor" WHERE "clinicId" = hiroshima_id AND "name" = '相原先生') THEN
                INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
                VALUES (gen_random_uuid()::text, hiroshima_id, '相原先生', NOW(), NOW());
            END IF;
            IF NOT EXISTS (SELECT 1 FROM "Doctor" WHERE "clinicId" = hiroshima_id AND "name" = '松本院長') THEN
                INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
                VALUES (gen_random_uuid()::text, hiroshima_id, '松本院長', NOW(), NOW());
            END IF;
            IF NOT EXISTS (SELECT 1 FROM "Doctor" WHERE "clinicId" = hiroshima_id AND "name" = '花ノ木先生') THEN
                INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
                VALUES (gen_random_uuid()::text, hiroshima_id, '花ノ木先生', NOW(), NOW());
            END IF;
            IF NOT EXISTS (SELECT 1 FROM "Doctor" WHERE "clinicId" = hiroshima_id AND "name" = '高木先生') THEN
                INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
                VALUES (gen_random_uuid()::text, hiroshima_id, '高木先生', NOW(), NOW());
            END IF;
            IF NOT EXISTS (SELECT 1 FROM "Doctor" WHERE "clinicId" = hiroshima_id AND "name" = '看護師') THEN
                INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
                VALUES (gen_random_uuid()::text, hiroshima_id, '看護師', NOW(), NOW());
            END IF;
        END IF;
    END IF;
END $$;

-- 福岡院の先生
DO $$
DECLARE
    fukuoka_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO fukuoka_id FROM "Clinic" WHERE "name" = '福岡院' LIMIT 1;
    
    IF fukuoka_id IS NOT NULL THEN
        -- 既存の医師数を確認
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = fukuoka_id;
        
        -- 医師が存在しない場合のみ追加
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, fukuoka_id, '菊池院長', NOW(), NOW()),
                (gen_random_uuid()::text, fukuoka_id, '白水先生', NOW(), NOW()),
                (gen_random_uuid()::text, fukuoka_id, '早川先生', NOW(), NOW()),
                (gen_random_uuid()::text, fukuoka_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 岡山院の先生
DO $$
DECLARE
    okayama_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO okayama_id FROM "Clinic" WHERE "name" = '岡山院' LIMIT 1;
    
    IF okayama_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = okayama_id;
        
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, okayama_id, '高橋院長', NOW(), NOW()),
                (gen_random_uuid()::text, okayama_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 京都院の先生
DO $$
DECLARE
    kyoto_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO kyoto_id FROM "Clinic" WHERE "name" = '京都院' LIMIT 1;
    
    IF kyoto_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = kyoto_id;
        
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, kyoto_id, '内山院長', NOW(), NOW()),
                (gen_random_uuid()::text, kyoto_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 熊本院の先生
DO $$
DECLARE
    kumamoto_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO kumamoto_id FROM "Clinic" WHERE "name" = '熊本院' LIMIT 1;
    
    IF kumamoto_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = kumamoto_id;
        
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, kumamoto_id, '佐古院長', NOW(), NOW()),
                (gen_random_uuid()::text, kumamoto_id, '境先生', NOW(), NOW()),
                (gen_random_uuid()::text, kumamoto_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 大阪院の先生
DO $$
DECLARE
    osaka_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO osaka_id FROM "Clinic" WHERE "name" = '大阪院' LIMIT 1;
    
    IF osaka_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = osaka_id;
        
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, osaka_id, '佐藤院長', NOW(), NOW()),
                (gen_random_uuid()::text, osaka_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 神戸院の先生
DO $$
DECLARE
    kobe_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO kobe_id FROM "Clinic" WHERE "name" = '神戸院' LIMIT 1;
    
    IF kobe_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = kobe_id;
        
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, kobe_id, '七里院長', NOW(), NOW()),
                (gen_random_uuid()::text, kobe_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 表参道院の先生
DO $$
DECLARE
    omotesando_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO omotesando_id FROM "Clinic" WHERE "name" = '表参道院' LIMIT 1;
    
    IF omotesando_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = omotesando_id;
        
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, omotesando_id, '土井院長', NOW(), NOW()),
                (gen_random_uuid()::text, omotesando_id, '藤内先生', NOW(), NOW()),
                (gen_random_uuid()::text, omotesando_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 麻布院の先生
DO $$
DECLARE
    azabu_id TEXT;
    doctor_count INTEGER;
BEGIN
    SELECT "id" INTO azabu_id FROM "Clinic" WHERE "name" = '麻布院' LIMIT 1;
    
    IF azabu_id IS NOT NULL THEN
        SELECT COUNT(*) INTO doctor_count FROM "Doctor" WHERE "clinicId" = azabu_id;
        
        IF doctor_count = 0 THEN
            INSERT INTO "Doctor" ("id", "clinicId", "name", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid()::text, azabu_id, '先生', NOW(), NOW()),
                (gen_random_uuid()::text, azabu_id, '看護師', NOW(), NOW());
        END IF;
    END IF;
END $$;

-- 復元後の確認
SELECT '=== 復元後の各院の医師一覧 ===' as info;
SELECT c.name as clinic_name, d.name as doctor_name
FROM "Doctor" d
JOIN "Clinic" c ON d."clinicId" = c.id
ORDER BY c.name, d.name;

-- 各院の医師数を確認
SELECT '=== 各院の医師数 ===' as info;
SELECT c.name as clinic_name, COUNT(d.id) as doctor_count
FROM "Clinic" c
LEFT JOIN "Doctor" d ON c.id = d."clinicId"
GROUP BY c.name
ORDER BY c.name;

