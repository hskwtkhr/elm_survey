-- QuestionOptionテーブルを作成
CREATE TABLE IF NOT EXISTS "QuestionOption" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- 複合ユニーク制約
CREATE UNIQUE INDEX IF NOT EXISTS "QuestionOption_category_value_key" ON "QuestionOption"("category", "value");

-- インデックス
CREATE INDEX IF NOT EXISTS "QuestionOption_category_order_idx" ON "QuestionOption"("category", "order");

-- 初期データを投入
INSERT INTO "QuestionOption" ("id", "category", "label", "value", "order", "createdAt", "updatedAt")
VALUES
    -- 性別
    (gen_random_uuid()::text, 'gender', '男性', '男性', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'gender', '女性', '女性', 1, NOW(), NOW()),
    
    -- 年齢層
    (gen_random_uuid()::text, 'ageGroup', '10代', '10代', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'ageGroup', '20代', '20代', 1, NOW(), NOW()),
    (gen_random_uuid()::text, 'ageGroup', '30代', '30代', 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'ageGroup', '40代', '40代', 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'ageGroup', '50代', '50代', 4, NOW(), NOW()),
    (gen_random_uuid()::text, 'ageGroup', '60代', '60代', 5, NOW(), NOW()),
    (gen_random_uuid()::text, 'ageGroup', '70代', '70代', 6, NOW(), NOW()),
    (gen_random_uuid()::text, 'ageGroup', '80代', '80代', 7, NOW(), NOW()),
    
    -- 満足度
    (gen_random_uuid()::text, 'satisfaction', '大変満足', '大変満足', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'satisfaction', '満足', '満足', 1, NOW(), NOW()),
    (gen_random_uuid()::text, 'satisfaction', '普通', '普通', 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'satisfaction', 'やや不満', 'やや不満', 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'satisfaction', '不満', '不満', 4, NOW(), NOW()),
    
    -- 結果への満足度
    (gen_random_uuid()::text, 'resultSatisfaction', '大変満足', '大変満足', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'resultSatisfaction', '満足', '満足', 1, NOW(), NOW()),
    (gen_random_uuid()::text, 'resultSatisfaction', '普通', '普通', 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'resultSatisfaction', 'やや不満', 'やや不満', 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'resultSatisfaction', '不満', '不満', 4, NOW(), NOW()),
    
    -- カウンセリングへの満足度
    (gen_random_uuid()::text, 'counselingSatisfaction', 'とても満足', 'とても満足', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'counselingSatisfaction', '満足', '満足', 1, NOW(), NOW()),
    (gen_random_uuid()::text, 'counselingSatisfaction', '普通', '普通', 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'counselingSatisfaction', 'やや不満', 'やや不満', 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'counselingSatisfaction', '不満', '不満', 4, NOW(), NOW()),
    
    -- 院内の雰囲気
    (gen_random_uuid()::text, 'atmosphereRating', 'とても良い', 'とても良い', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'atmosphereRating', '良い', '良い', 1, NOW(), NOW()),
    (gen_random_uuid()::text, 'atmosphereRating', '普通', '普通', 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'atmosphereRating', 'やや悪い', 'やや悪い', 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'atmosphereRating', '悪い', '悪い', 4, NOW(), NOW()),
    
    -- スタッフの対応
    (gen_random_uuid()::text, 'staffServiceRating', 'とても丁寧だった', 'とても丁寧だった', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'staffServiceRating', '丁寧だった', '丁寧だった', 1, NOW(), NOW()),
    (gen_random_uuid()::text, 'staffServiceRating', '普通', '普通', 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'staffServiceRating', 'やや不満', 'やや不満', 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'staffServiceRating', '不満', '不満', 4, NOW(), NOW())
ON CONFLICT ("category", "value") DO NOTHING;


