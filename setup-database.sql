-- エルムクリニック アンケートサイト データベースセットアップ
-- SupabaseのSQL Editorで実行してください

-- UUID拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clinic（院）テーブル
CREATE TABLE IF NOT EXISTS "Clinic" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "google_review_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Doctor（先生）テーブル
CREATE TABLE IF NOT EXISTS "Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Doctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Doctorテーブルにインデックスを作成
CREATE INDEX IF NOT EXISTS "Doctor_clinicId_idx" ON "Doctor"("clinicId");

-- Survey（アンケート）テーブル
CREATE TABLE IF NOT EXISTS "Survey" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clinicId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "treatmentDate" TIMESTAMP(3) NOT NULL,
    "treatmentMenu" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "satisfaction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Survey_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Survey_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Surveyテーブルにインデックスを作成
CREATE INDEX IF NOT EXISTS "Survey_clinicId_idx" ON "Survey"("clinicId");
CREATE INDEX IF NOT EXISTS "Survey_doctorId_idx" ON "Survey"("doctorId");
CREATE INDEX IF NOT EXISTS "Survey_treatmentDate_idx" ON "Survey"("treatmentDate");
CREATE INDEX IF NOT EXISTS "Survey_satisfaction_idx" ON "Survey"("satisfaction");

-- AdminUser（管理者）テーブル
CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "username" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);


