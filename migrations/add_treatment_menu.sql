-- CreateTable
CREATE TABLE IF NOT EXISTS "TreatmentMenu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentMenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TreatmentMenu_name_key" ON "TreatmentMenu"("name");

-- 初期データを投入
INSERT INTO "TreatmentMenu" ("id", "name", "order", "createdAt", "updatedAt")
VALUES
    (gen_random_uuid()::text, 'ボトックス注射', 0, NOW(), NOW()),
    (gen_random_uuid()::text, 'ヒアルロン酸注射', 1, NOW(), NOW()),
    (gen_random_uuid()::text, '糸リフト', 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'アートメイク', 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'フォトフェイシャル', 4, NOW(), NOW()),
    (gen_random_uuid()::text, 'ポテンツァ', 5, NOW(), NOW()),
    (gen_random_uuid()::text, 'その他', 6, NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;

