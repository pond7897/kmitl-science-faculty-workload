ALTER TABLE "teaching_schedule"
ADD COLUMN IF NOT EXISTS "note" TEXT,
ADD COLUMN IF NOT EXISTS "attachment_file_name" TEXT,
ADD COLUMN IF NOT EXISTS "attachment_file_data" TEXT;
