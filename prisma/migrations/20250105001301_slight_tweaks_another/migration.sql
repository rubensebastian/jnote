/*
  Warnings:

  - You are about to drop the column `organization` on the `job_responsibility` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `job_responsibility` table. All the data in the column will be lost.
  - Added the required column `organization` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `job_responsibility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job" ADD COLUMN     "organization" VARCHAR(255) NOT NULL,
ALTER COLUMN "applied_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "job_responsibility" DROP COLUMN "organization",
DROP COLUMN "title",
ADD COLUMN     "description" TEXT NOT NULL;
