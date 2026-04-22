"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardList, LibraryBig, StickyNote, Paperclip } from "lucide-react";
import { TwoColumnSummary } from "./TwoColumnSummary";
import { StudentTypeSummary } from "./StudentTypeSummary";
import { WeekBadgesSection } from "./WeekBadgesSection";
import { CheckActionButtons } from "./CheckActionButtons";
import { AttachmentDisplay } from "./AttachmentDisplay";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { ConfirmationDialog } from "@/components/alerts";
import { useAlert } from "@/hooks/use-alert";

interface TimeRange {
  start: string;
  end: string;
}

interface WeekEntry {
  weekNumber: number;
  isSelected: boolean;
  hasSpecialLecturer?: boolean;
  coLecturerName?: string;
}

interface WorkloadCheckFormProps {
  courseCode: string;
  courseName: string;
  creditUnits: number | null;
  degreeLevel: string;
  lectureTime: TimeRange;
  labTime: TimeRange;
  faculty: string;
  major: string;
  year: string;
  studyGroup: string;
  studyGroupLabel?: string; // ← เพิ่ม: label ที่ resolve แล้วจาก studyGroupOptions
  enrolledStudents: string;
  weeklyStudents: string;
  lectureWeeks: WeekEntry[];
  labWeeks: WeekEntry[];
  attachedFileName?: string | null;
  attachedFileData?: string | null;
  notes?: string;
  academicYear?: string;
  semester?: string;
  dayOfWeek?: string;
  onEdit: () => void;
  onConfirm: () => Promise<void>;
}

export function WorkloadCheckForm({
  courseCode,
  courseName,
  creditUnits,
  degreeLevel,
  lectureTime,
  labTime,
  faculty,
  major,
  year,
  studyGroup,
  studyGroupLabel,
  enrolledStudents,
  weeklyStudents,
  lectureWeeks,
  labWeeks,
  attachedFileName,
  attachedFileData,
  notes,
  academicYear,
  semester,
  dayOfWeek,
  onEdit,
  onConfirm,
}: WorkloadCheckFormProps) {
  const { t } = useTranslation();
  const alert = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewData, setPreviewData] = useState<{
    fileName: string;
    fileData: string;
  } | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      alert.error({
        title: t("Alert.errorTitle"),
        description: error instanceof Error
          ? error.message
          : t("Alert.errorDescription"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewClick = (fileName: string, fileData: string) => {
    setPreviewData({ fileName, fileData });
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewData(null);
  };

  const degreeLevelMap: Record<string, string> = {
    bachelor_regular:       t("WorkloadEntry.degreeLevelBachelor"),
    bachelor_international: t("WorkloadEntry.degreeLevelInternational"),
    master:                 t("WorkloadEntry.degreeLevelMaster"),
  };
  const degreeLevelDisplay = degreeLevelMap[degreeLevel] || degreeLevel;

  const dayNameMap: Record<string, string> = {
    sunday:    "อาทิตย์",
    monday:    "จันทร์",
    tuesday:   "อังคาร",
    wednesday: "พุธ",
    thursday:  "พฤหัสบดี",
    friday:    "ศุกร์",
    saturday:  "เสาร์",
  };

  const fmtTime = (tr: TimeRange) =>
    tr.start && tr.end ? `${tr.start} – ${tr.end}` : "—";

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* ── Page Title ── */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          {t("WorkloadFormCheck.title")}
        </h1>
        <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-[#8b7f77]">
          {academicYear && semester
            ? `${t("WorkloadForm.academicYear")} ${academicYear} ${t("WorkloadForm.semesterLabel")} ${semester}${dayOfWeek ? ` วัน${dayNameMap[dayOfWeek] || dayOfWeek}` : ""}`
            : t("WorkloadFormCheck.subtitle")
          }
        </p>
      </div>

      {/* ── 1. Course Info + Teaching Info ── */}
      <TwoColumnSummary
        leftTitle={t("WorkloadFormCheck.courseInfo")}
        leftIcon={ClipboardList}
        leftItems={[
          { label: t("WorkloadFormCheck.courseCode"), value: courseCode || "—" },
          { label: t("WorkloadFormCheck.courseName"), value: courseName || "—" },
          {
            label: t("WorkloadFormCheck.creditUnits"),
            value: creditUnits != null
              ? `${creditUnits} ${t("WorkloadEntry.units")}`
              : "—",
          },
        ]}
        rightTitle={t("WorkloadFormCheck.teachingInfo")}
        rightIcon={LibraryBig}
        rightItems={[
          { label: t("WorkloadFormCheck.degreeLevel"), value: degreeLevelDisplay },
          { label: t("WorkloadFormCheck.lectureTime"), value: fmtTime(lectureTime) },
          { label: t("WorkloadFormCheck.labTime"),     value: fmtTime(labTime) },
        ]}
      />

      {/* ── 2. Student Type ── */}
      <StudentTypeSummary
        faculty={faculty}
        major={major}
        year={year}
        studyGroup={studyGroup}
        studyGroupLabel={studyGroupLabel} // ← ส่ง label ที่ resolve แล้วมาด้วย
        enrolledStudents={enrolledStudents}
        weeklyStudents={weeklyStudents}
      />

      {/* ── 3. Teaching Weeks ── */}
      <WeekBadgesSection
        title={t("WorkloadEntry.teachingWeeks")}
        typeLabel={t("WorkloadEntry.lecture")}
        weeks={lectureWeeks}
      />

      <WeekBadgesSection
        title={t("WorkloadEntry.teachingWeeks")}
        typeLabel={t("WorkloadEntry.lab")}
        weeks={labWeeks}
      />

      {/* ── 4. Additional ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
        <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
              <Paperclip className="h-4 w-4" />
            </span>
            {t("WorkloadEntry.additional")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-[#b8aaa0] flex items-center gap-1.5">
              📎 {t("WorkloadEntry.attachment")}
            </p>
            <AttachmentDisplay
              fileName={attachedFileName}
              fileData={attachedFileData}
              onPreviewClick={handlePreviewClick}
              courseCode={courseCode}
              courseName={courseName}
              creditUnits={creditUnits}
              degreeLevel={degreeLevel}
              facultyName={faculty}
              majorName={major}
              yearName={year}
              groupName={studyGroup}
              enrolledStudents={enrolledStudents}
              weeklyStudents={weeklyStudents}
              lectureTimeStart={lectureTime.start}
              lectureTimeEnd={lectureTime.end}
              labTimeStart={labTime.start}
              labTimeEnd={labTime.end}
              notes={notes}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-[#b8aaa0] flex items-center gap-1.5">
              <StickyNote className="h-3.5 w-3.5" />
              {t("WorkloadEntry.notes")}
            </p>
            <div className="px-3 sm:px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 dark:border-[#4a4441] dark:bg-[#3d3533] min-h-14 sm:min-h-16 flex items-start">
              {notes ? (
                <span className="text-sm text-gray-800 dark:text-[#f0ebe5] whitespace-pre-wrap">
                  {notes}
                </span>
              ) : (
                <span className="text-sm text-gray-400 dark:text-[#5a5350]">—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <CheckActionButtons
        onEdit={onEdit}
        onConfirm={() => setShowConfirmDialog(true)}
        isLoading={isLoading}
      />

      {/* ── Confirmation Dialog ── */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title={t("WorkloadFormCheck.confirmTitle") || "ยืนยันข้อมูล"}
        description={t("WorkloadFormCheck.confirmDescription") || "คุณแน่ใจที่จะยืนยันข้อมูลภาระงานนี้หรือไม่?"}
        confirmText={t("Alert.confirm")}
        cancelText={t("Alert.cancel")}
        variant="success"
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* ── Image Preview Modal ── */}
      {previewData && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          fileName={previewData.fileName}
          fileData={previewData.fileData}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
}