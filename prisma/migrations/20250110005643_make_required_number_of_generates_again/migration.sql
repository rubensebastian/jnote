/*
  Warnings:

  - Made the column `number_of_generates` on table `applicant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "applicant" ALTER COLUMN "number_of_generates" SET NOT NULL;
