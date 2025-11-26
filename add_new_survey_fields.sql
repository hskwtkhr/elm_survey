-- 新しいアンケートフィールドを追加
-- SupabaseのSQL Editorで実行してください

ALTER TABLE "Survey" ADD COLUMN IF NOT EXISTS "resultSatisfaction" TEXT;
ALTER TABLE "Survey" ADD COLUMN IF NOT EXISTS "counselingSatisfaction" TEXT;
ALTER TABLE "Survey" ADD COLUMN IF NOT EXISTS "atmosphereRating" TEXT;
ALTER TABLE "Survey" ADD COLUMN IF NOT EXISTS "staffServiceRating" TEXT;

