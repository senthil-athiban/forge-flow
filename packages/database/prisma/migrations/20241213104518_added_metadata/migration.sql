/*
  Warnings:

  - Added the required column `metadata` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "metadata" JSONB NOT NULL;
