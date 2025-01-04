/*
  Warnings:

  - A unique constraint covering the columns `[verification_token]` on the table `applicant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "applicant_verification_token_key" ON "applicant"("verification_token");
