-- ========================================
-- 重複している院（Clinic）レコードを確認・削除
-- ========================================
-- SupabaseのSQL Editorで実行してください

-- 1. 重複している院名を確認
SELECT name, COUNT(*) as count
FROM "Clinic"
GROUP BY name
HAVING COUNT(*) > 1;

-- 2. 重複している院の詳細を確認
SELECT id, name, "google_review_url", "createdAt"
FROM "Clinic"
WHERE name IN (
    SELECT name
    FROM "Clinic"
    GROUP BY name
    HAVING COUNT(*) > 1
)
ORDER BY name, "createdAt";

-- 3. 重複している院を削除（各院名ごとに最新のレコード以外を削除）
-- 注意：このクエリを実行する前に、上記のクエリで重複を確認してください
-- また、削除する前に、該当するDoctorレコードが正しいClinicに関連付けられているか確認してください

-- 各院名ごとに、最新のレコード以外を削除（同じ院名の場合、最も新しいcreatedAtを持つレコードを残す）
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

-- 4. 削除後の確認（各院名が1つだけ存在することを確認）
SELECT name, COUNT(*) as count
FROM "Clinic"
GROUP BY name
ORDER BY name;


