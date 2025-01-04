/*
  Warnings:

  - Added the required column `verified` to the `applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applicant" ADD COLUMN     "verified" BOOLEAN NOT NULL;
