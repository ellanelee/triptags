-- AlterTable
ALTER TABLE "local_verifications" ALTER COLUMN "region_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "destination" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "region_id" UUID NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destination_user_id_region_id_key" ON "destination"("user_id", "region_id");

-- AddForeignKey
ALTER TABLE "destination" ADD CONSTRAINT "destination_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination" ADD CONSTRAINT "destination_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
