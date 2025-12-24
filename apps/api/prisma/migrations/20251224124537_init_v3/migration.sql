-- AlterTable
ALTER TABLE "venue_details" ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "price_range" DROP NOT NULL,
ALTER COLUMN "sub_category" DROP NOT NULL,
ALTER COLUMN "website_url" DROP NOT NULL,
ALTER COLUMN "work_hour" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
