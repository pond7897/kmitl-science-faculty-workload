/*
  Warnings:

  - The values [faculty,head_of_depart] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('professor', 'department_head', 'secretary', 'hr', 'academic', 'finance', 'support_director', 'vice_dean', 'dean');

-- CreateEnum
CREATE TYPE "ProcessType" AS ENUM ('draft', 'submitted', 'approved', 'rejected');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'staff');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'staff';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academic_position" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "department_id" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "position" "Position" DEFAULT 'professor',
ADD COLUMN     "resignation_date" TIMESTAMP(3),
ADD COLUMN     "retire_date" TIMESTAMP(3),
ALTER COLUMN "role" SET DEFAULT 'staff';

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "users_id" TEXT NOT NULL,
    "process" "ProcessType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_year" (
    "year_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,

    CONSTRAINT "academic_year_pkey" PRIMARY KEY ("year_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "courses_id" TEXT NOT NULL,
    "courses_name" TEXT NOT NULL,
    "credits" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("courses_id")
);

-- CreateTable
CREATE TABLE "sections" (
    "section_id" TEXT NOT NULL,
    "courses_id" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "year_level" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "students_registered" INTEGER NOT NULL,
    "students_per_week" INTEGER NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "teaching_schedule" (
    "schedule_id" TEXT NOT NULL,
    "users_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "teaching_weeks_lab" INTEGER NOT NULL,
    "teaching_weeks_theory" INTEGER NOT NULL,
    "teaching_workload_lab" INTEGER NOT NULL,
    "teaching_workload_theory" INTEGER NOT NULL,

    CONSTRAINT "teaching_schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "teaching_weeks_lab" (
    "week_id_lab" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "users_id" TEXT NOT NULL,
    "external_speaker" BOOLEAN NOT NULL,
    "pdf_file" TEXT,

    CONSTRAINT "teaching_weeks_lab_pkey" PRIMARY KEY ("week_id_lab")
);

-- CreateTable
CREATE TABLE "teaching_weeks_theory" (
    "week_id_theory" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "theory_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "users_id" TEXT NOT NULL,
    "external_speaker" BOOLEAN NOT NULL,
    "pdf_file" TEXT,

    CONSTRAINT "teaching_weeks_theory_pkey" PRIMARY KEY ("week_id_theory")
);

-- CreateTable
CREATE TABLE "lab" (
    "lab_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "hours_per_week" INTEGER NOT NULL,

    CONSTRAINT "lab_pkey" PRIMARY KEY ("lab_id")
);

-- CreateTable
CREATE TABLE "theory" (
    "theory_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "hours_per_week" INTEGER NOT NULL,

    CONSTRAINT "theory_pkey" PRIMARY KEY ("theory_id")
);

-- CreateTable
CREATE TABLE "teaching_workload_lab" (
    "workload_id_lab" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "total_weeks" INTEGER NOT NULL,
    "total_hours" DOUBLE PRECISION NOT NULL,
    "teaching_workload" DOUBLE PRECISION NOT NULL,
    "overload_hours" DOUBLE PRECISION NOT NULL,
    "note" TEXT,

    CONSTRAINT "teaching_workload_lab_pkey" PRIMARY KEY ("workload_id_lab")
);

-- CreateTable
CREATE TABLE "teaching_workload_theory" (
    "workload_id_theory" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "total_weeks" INTEGER NOT NULL,
    "total_hours" DOUBLE PRECISION NOT NULL,
    "teaching_workload" DOUBLE PRECISION NOT NULL,
    "overload_hours" DOUBLE PRECISION NOT NULL,
    "note" TEXT,

    CONSTRAINT "teaching_workload_theory_pkey" PRIMARY KEY ("workload_id_theory")
);

-- CreateTable
CREATE TABLE "history" (
    "history_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("history_id")
);

-- CreateIndex
CREATE INDEX "process_users_id_idx" ON "process"("users_id");

-- CreateIndex
CREATE INDEX "process_schedule_id_idx" ON "process"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "teaching_workload_lab_schedule_id_key" ON "teaching_workload_lab"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "teaching_workload_theory_schedule_id_key" ON "teaching_workload_theory"("schedule_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "teaching_schedule"("schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year" ADD CONSTRAINT "academic_year_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_courses_id_fkey" FOREIGN KEY ("courses_id") REFERENCES "courses"("courses_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_schedule" ADD CONSTRAINT "teaching_schedule_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_schedule" ADD CONSTRAINT "teaching_schedule_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "academic_year"("year_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_weeks_lab" ADD CONSTRAINT "teaching_weeks_lab_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "teaching_schedule"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_weeks_lab" ADD CONSTRAINT "teaching_weeks_lab_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "lab"("lab_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_weeks_lab" ADD CONSTRAINT "teaching_weeks_lab_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_weeks_theory" ADD CONSTRAINT "teaching_weeks_theory_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "teaching_schedule"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_weeks_theory" ADD CONSTRAINT "teaching_weeks_theory_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theory"("theory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_weeks_theory" ADD CONSTRAINT "teaching_weeks_theory_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_workload_lab" ADD CONSTRAINT "teaching_workload_lab_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "teaching_schedule"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_workload_theory" ADD CONSTRAINT "teaching_workload_theory_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "teaching_schedule"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "academic_year"("year_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "teaching_schedule"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;
