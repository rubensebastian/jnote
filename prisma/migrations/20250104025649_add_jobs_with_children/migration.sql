-- CreateEnum
CREATE TYPE "Range" AS ENUM ('HIGH', 'LOW');

-- CreateEnum
CREATE TYPE "Required" AS ENUM ('REQUIRED', 'PREFERRED');

-- CreateTable
CREATE TABLE "applicant" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" BIGSERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "field" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "institution" VARCHAR(255) NOT NULL,
    "level" VARCHAR(20) NOT NULL,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" BIGSERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "organization" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsibility" (
    "id" BIGSERIAL NOT NULL,
    "experience_id" BIGINT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "responsibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" BIGSERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "applied_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_education" (
    "id" BIGSERIAL NOT NULL,
    "job_id" BIGINT NOT NULL,
    "field" VARCHAR(255) NOT NULL,
    "required" "Required" NOT NULL,

    CONSTRAINT "job_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_responsibility" (
    "id" BIGSERIAL NOT NULL,
    "job_id" BIGINT NOT NULL,
    "organization" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "required" "Required" NOT NULL,

    CONSTRAINT "job_responsibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_description" (
    "id" BIGSERIAL NOT NULL,
    "job_id" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "job_description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary" (
    "id" BIGSERIAL NOT NULL,
    "job_id" BIGINT NOT NULL,
    "range" "Range" NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applicant_username_key" ON "applicant"("username");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_email_key" ON "applicant"("email");

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "responsibility" ADD CONSTRAINT "responsibility_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_education" ADD CONSTRAINT "job_education_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_responsibility" ADD CONSTRAINT "job_responsibility_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_description" ADD CONSTRAINT "job_description_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salary" ADD CONSTRAINT "salary_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
