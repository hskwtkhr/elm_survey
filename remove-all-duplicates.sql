-- ========================================
-- 重複している院（Clinic）と医師（Doctor）レコードを削除
-- ========================================
-- SupabaseのSQL Editorで実行してください
-- 
-- ⚠️ 注意：このスクリプトを実行する前に、必ずバックアップを取ってください
-- ⚠️ 既存のSurveyレコードがある場合、関連するClinicやDoctorが削除される可能性があります

-- ========================================
-- ステップ1: 重複状況を確認
-- ========================================

-- 院の重複を確認
SELECT '=== 院の重複確認 ===' as info;
SELECT name, COUNT(*) as count
FROM "Clinic"
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY name;

-- 医師の重複を確認（同じ院名、同じ医師名の組み合わせ）
SELECT '=== 医師の重複確認 ===' as info;
SELECT c.name as clinic_name, d.name as doctor_name, COUNT(*) as count
FROM "Doctor" d
JOIN "Clinic" c ON d."clinicId" = c.id
GROUP BY c.name, d.name
HAVING COUNT(*) > 1
ORDER BY c.name, d.name;

-- ========================================
-- ステップ2: 各院名ごとに、最新のレコード以外を削除
-- ========================================

-- まず、削除対象のClinic IDを確認（実行前に確認用）
SELECT '=== 削除対象の院ID（確認用） ===' as info;
SELECT id, name, "createdAt"
FROM (
    SELECT id, name, "createdAt",
           ROW_NUMBER() OVER (PARTITION BY name ORDER BY "createdAt" DESC) as rn
    FROM "Clinic"
) t
WHERE t.rn > 1
ORDER BY name, "createdAt";

-- 重複している院を削除（各院名ごとに最新のレコード以外を削除）
-- 注意：CASCADEにより、関連するDoctorとSurveyも自動的に削除されます
DELETE FROM "Clinic"
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY name ORDER BY "createdAt" DESC) as rn
        FROM "Clinic"
    ) t
    WHERE t.rn > 1
);

-- ========================================
-- ステップ3: 残っている医師の重複を削除（同じ院、同じ医師名の組み合わせ）
-- ========================================

-- まず、削除対象のDoctor IDを確認（実行前に確認用）
SELECT '=== 削除対象の医師ID（確認用） ===' as info;
SELECT d.id, c.name as clinic_name, d.name as doctor_name, d."createdAt"
FROM "Doctor" d
JOIN "Clinic" c ON d."clinicId" = c.id
WHERE (c.name, d.name) IN (
    SELECT c2.name, d2.name
    FROM "Doctor" d2
    JOIN "Clinic" c2 ON d2."clinicId" = c2.id
    GROUP BY c2.name, d2.name
    HAVING COUNT(*) > 1
)
AND d.id NOT IN (
    -- 各組み合わせで最新のレコードを残す
    SELECT DISTINCT ON (c3.name, d3.name) d3.id
    FROM "Doctor" d3
    JOIN "Clinic" c3 ON d3."clinicId" = c3.id
    WHERE (c3.name, d3.name) IN (
        SELECT c4.name, d4.name
        FROM "Doctor" d4
        JOIN "Clinic" c4 ON d4."clinicId" = c4.id
        GROUP BY c4.name, d4.name
        HAVING COUNT(*) > 1
    )
    ORDER BY c3.name, d3.name, d3."createdAt" DESC
)
ORDER BY c.name, d.name, d."createdAt";

-- 重複している医師を削除（同じ院、同じ医師名の組み合わせで、最新以外を削除）
-- 注意：CASCADEにより、関連するSurveyも自動的に削除されます
DELETE FROM "Doctor"
WHERE id IN (
    SELECT d.id
    FROM "Doctor" d
    JOIN "Clinic" c ON d."clinicId" = c.id
    WHERE (c.name, d.name) IN (
        SELECT c2.name, d2.name
        FROM "Doctor" d2
        JOIN "Clinic" c2 ON d2."clinicId" = c2.id
        GROUP BY c2.name, d2.name
        HAVING COUNT(*) > 1
    )
    AND d.id NOT IN (
        -- 各組み合わせで最新のレコードを残す
        SELECT DISTINCT ON (c3.name, d3.name) d3.id
        FROM "Doctor" d3
        JOIN "Clinic" c3 ON d3."clinicId" = c3.id
        WHERE (c3.name, d3.name) IN (
            SELECT c4.name, d4.name
            FROM "Doctor" d4
            JOIN "Clinic" c4 ON d4."clinicId" = c4.id
            GROUP BY c4.name, d4.name
            HAVING COUNT(*) > 1
        )
        ORDER BY c3.name, d3.name, d3."createdAt" DESC
    )
);

-- ========================================
-- ステップ4: 削除後の確認
-- ========================================

-- 院の確認（各院名が1つだけ存在することを確認）
SELECT '=== 削除後の院確認 ===' as info;
SELECT name, COUNT(*) as count
FROM "Clinic"
GROUP BY name
ORDER BY name;

-- 医師の確認（各院、各医師名の組み合わせが1つだけ存在することを確認）
SELECT '=== 削除後の医師確認 ===' as info;
SELECT c.name as clinic_name, d.name as doctor_name, COUNT(*) as count
FROM "Doctor" d
JOIN "Clinic" c ON d."clinicId" = c.id
GROUP BY c.name, d.name
ORDER BY c.name, d.name;

-- 各院の医師一覧を表示
SELECT '=== 各院の医師一覧 ===' as info;
SELECT c.name as clinic_name, d.name as doctor_name
FROM "Doctor" d
JOIN "Clinic" c ON d."clinicId" = c.id
ORDER BY c.name, d.name;


