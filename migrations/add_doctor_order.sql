-- Doctorテーブルにorderカラムを追加
ALTER TABLE "Doctor" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

-- 既存の先生に順番を設定（院ごと、作成日時順）
UPDATE "Doctor" d
SET "order" = sub.row_num - 1
FROM (
    SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY "clinicId" ORDER BY "createdAt" ASC) as row_num
    FROM "Doctor"
) sub
WHERE d.id = sub.id;


