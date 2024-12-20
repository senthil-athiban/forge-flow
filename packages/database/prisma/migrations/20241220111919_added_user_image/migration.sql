-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");
