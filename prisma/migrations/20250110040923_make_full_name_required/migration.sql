/*
  Warnings:

  - Made the column `full_name` on table `applicant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "applicant" ALTER COLUMN "full_name" SET NOT NULL;
