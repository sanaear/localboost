-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "preferred_lang" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT,
    "name_fr" TEXT,
    "name_en" TEXT,
    "name_es" TEXT,
    "icon" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "region" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "description" TEXT,
    "images" TEXT[],
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "business_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "moderation_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationCache" (
    "cache_key" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationCache_pkey" PRIMARY KEY ("cache_key","lang")
);

-- CreateTable
CREATE TABLE "InactivityTracking" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "last_updated_at" TIMESTAMP(3),
    "last_notified_at" TIMESTAMP(3),

    CONSTRAINT "InactivityTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InactivityTracking_business_id_key" ON "InactivityTracking"("business_id");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InactivityTracking" ADD CONSTRAINT "InactivityTracking_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
