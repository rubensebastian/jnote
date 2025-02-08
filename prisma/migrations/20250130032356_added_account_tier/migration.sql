-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('STANDARD', 'PRO', 'PREMIUM');

-- AlterTable
ALTER TABLE "applicant" ADD COLUMN     "account_level" "Plan" NOT NULL DEFAULT 'STANDARD';
