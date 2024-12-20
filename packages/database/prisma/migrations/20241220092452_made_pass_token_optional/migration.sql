/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerUserId]` on the table `OAuthAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OAuthAccount" ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "accessToken" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_provider_providerUserId_key" ON "OAuthAccount"("provider", "providerUserId");
