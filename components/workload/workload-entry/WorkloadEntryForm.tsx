"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import { CourseInfoSection } from "./CourseInfoSection";
import { TeachingInfoSection } from "./TeachingInfoSection";
import { StudentTypeSection } from "./StudentTypeSection";
import {
  TeachingWeeksSection,
  buildDefaultWeeks,
} from "./TeachingWeeksSection";
import type { WeekEntry } from "./TeachingWeeksSection";
import { AdditionalSection } from "./AdditionalSection";

interface TimeRange {
  start: string;
  end: string;
}

interface EntryFormData {
  courseCode: string;
  courseName: string;
  creditUnits: number | null;
  degreeLevel: string;
  lectureTime: TimeRange;
  labTime: TimeRange;
  faculty: string;
  major: string;
  year: string;
  group: string;
  enrolledStudents: string;
  weeklyStudents: string;
  lectureWeeks: WeekEntry[];
  labWeeks: WeekEntry[];
  attachedFile: File | null;
  notes: string;
}

const DAY_NAMES_TH: Record<string, string> = {
  sunday: "อาทิตย์",
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
};

const DAY_NAMES_EN: Record<string, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

const MOCK_LECTURE_LOCKED = [
  { weekNumber: 10, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 11, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 12, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 13, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 14, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 15, lockedByName: "รศ.ดร.สมชาย" },
];

const TOTAL_WEEKS = 15;

export function WorkloadEntryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === "th";

  const semester = searchParams.get("semester") || "1";
  const year = searchParams.get("year") || "2568";
  const dayCode = searchParams.get("day") || "";

  const dayNameTh = dayCode ? DAY_NAMES_TH[dayCode] ?? dayCode : null;
  const dayNameEn = dayCode ? DAY_NAMES_EN[dayCode] ?? dayCode : null;

  const subtitleTh = dayNameTh
    ? `วัน${dayNameTh} ปีการศึกษา ${year} ภาคเรียนที่ ${semester}`
    : `ปีการศึกษา ${year} ภาคเรียนที่ ${semester}`;

  const subtitleEn = dayNameEn
    ? `${dayNameEn}, Academic Year ${parseInt(year) - 543}, Semester ${semester}`
    : `Academic Year ${parseInt(year) - 543}, Semester ${semester}`;

  const [formData, setFormData] = useState<EntryFormData>({
    courseCode: "",
    courseName: "",
    creditUnits: null,
    degreeLevel: "bachelor_regular",
    lectureTime: { start: "", end: "" },
    labTime: { start: "", end: "" },
    faculty: "",
    major: "",
    year: "",
    group: "",
    enrolledStudents: "",
    weeklyStudents: "",
    lectureWeeks: buildDefaultWeeks(TOTAL_WEEKS, MOCK_LECTURE_LOCKED),
    labWeeks: buildDefaultWeeks(TOTAL_WEEKS),
    attachedFile: null,
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof EntryFormData>(
    key: K,
    value: EntryFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user edits it
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // ── Handlers for nested time fields (clear per-subfield errors) ──
  const handleLectureTimeChange = (t: TimeRange) => {
    setFormData((prev) => ({ ...prev, lectureTime: t }));
    setErrors((prev) => {
      const next = { ...prev };
      if (t.start) delete next.lectureTimeStart;
      if (t.end) delete next.lectureTimeEnd;
      return next;
    });
  };

  const handleLabTimeChange = (t: TimeRange) => {
    setFormData((prev) => ({ ...prev, labTime: t }));
    setErrors((prev) => {
      const next = { ...prev };
      if (t.start) delete next.labTimeStart;
      if (t.end) delete next.labTimeEnd;
      return next;
    });
  };

  const mockCourseSearch = (
    code: string,
  ): Promise<{ name: string; credits: number } | null> =>
    new Promise((resolve) =>
      setTimeout(() => {
        const db: Record<string, { name: string; credits: number }> = {
          CS204: { name: "Data Systems Lab", credits: 3 },
          CS205: { name: "Web Development", credits: 4 },
          CS206: { name: "Database Management", credits: 3 },
          SA101: { name: "System Analyst (SA)", credits: 3 },
        };
        resolve(db[code.toUpperCase()] ?? null);
      }, 500),
    );

  const handleCourseSearch = async () => {
    if (!formData.courseCode) {
      setErrors({
        courseCode: isTh ? "กรุณาใส่รหัสวิชา" : "Please enter course code",
      });
      return;
    }
    setIsSearching(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.courseCode;
      delete next.courseName;
      return next;
    });
    try {
      const result = await mockCourseSearch(formData.courseCode);
      if (result) {
        setFormData((prev) => ({
          ...prev,
          courseName: result.name,
          creditUnits: result.credits,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          courseCode: isTh ? "ไม่พบรหัสวิชานี้ในระบบ" : "Course not found",
        }));
        setFormData((prev) => ({ ...prev, courseName: "", creditUnits: null }));
      }
    } finally {
      setIsSearching(false);
    }
  };

  // ── Validation ─────────────────────────────────────────────
  const validateForm = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.courseCode)
      e.courseCode = isTh ? "รหัสวิชา: จำเป็นต้องระบุ" : "Course Code: Required";
    if (!formData.courseName)
      e.courseName = isTh
        ? "ชื่อวิชา: กรุณาค้นหารหัสวิชาก่อน"
        : "Course Name: Please search for a course first";
    if (!formData.degreeLevel)
      e.degreeLevel = isTh ? "ระดับการศึกษา: จำเป็นต้องระบุ" : "Degree Level: Required";

    // ── Lecture time ──
    if (!formData.lectureTime.start)
      e.lectureTimeStart = isTh ? "เวลาสอนทฤษฎี (เริ่มต้น): จำเป็นต้องระบุ" : "Lecture Start Time: Required";
    if (!formData.lectureTime.end)
      e.lectureTimeEnd = isTh ? "เวลาสอนทฤษฎี (สิ้นสุด): จำเป็นต้องระบุ" : "Lecture End Time: Required";

    // ── Lab time ──
    if (!formData.labTime.start)
      e.labTimeStart = isTh ? "เวลาสอนปฏิบัติ (เริ่มต้น): จำเป็นต้องระบุ" : "Lab Start Time: Required";
    if (!formData.labTime.end)
      e.labTimeEnd = isTh ? "เวลาสอนปฏิบัติ (สิ้นสุด): จำเป็นต้องระบุ" : "Lab End Time: Required";

    if (!formData.faculty)
      e.faculty = isTh ? "คณะ: จำเป็นต้องระบุ" : "Faculty: Required";
    if (!formData.major)
      e.major = isTh ? "สาขาวิชา: จำเป็นต้องระบุ" : "Major: Required";
    if (!formData.year)
      e.year = isTh ? "ชั้นปี: จำเป็นต้องระบุ" : "Year: Required";
    if (!formData.group)
      e.group = isTh ? "กลุ่ม: จำเป็นต้องระบุ" : "Group: Required";
    if (!formData.enrolledStudents)
      e.enrolledStudents = isTh
        ? "จำนวนนักศึกษาที่ลงทะเบียน: จำเป็นต้องระบุ"
        : "Enrolled Students: Required";
    if (!formData.weeklyStudents)
      e.weeklyStudents = isTh
        ? "นักศึกษารายสัปดาห์: จำเป็นต้องระบุ"
        : "Weekly Students: Required";

    // ── Teaching weeks: at least 1 selected ──
    const hasLectureWeek = formData.lectureWeeks.some((w) => w.isSelected);
    if (!hasLectureWeek)
      e.lectureWeeks = isTh
        ? "สัปดาห์ที่สอน (ทฤษฎี): กรุณาเลือกอย่างน้อย 1 สัปดาห์"
        : "Lecture Weeks: Please select at least 1 week";

    const hasLabWeek = formData.labWeeks.some((w) => w.isSelected);
    if (!hasLabWeek)
      e.labWeeks = isTh
        ? "สัปดาห์ที่สอน (ปฏิบัติ): กรุณาเลือกอย่างน้อย 1 สัปดาห์"
        : "Lab Weeks: Please select at least 1 week";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCancel = () =>
    router.push(`/workload?semester=${semester}&year=${year}`);

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      console.log("Saving workload entry:", formData);
      await new Promise((r) => setTimeout(r, 1000));
      router.push(`/workload/review?semester=${semester}&year=${year}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          {isTh ? "เพิ่มข้อมูลการสอน" : "Add Teaching Assignment"}
        </h1>
        <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-[#8b7f77]">
          {isTh ? subtitleTh : subtitleEn}
        </p>
      </div>

      <div className="w-full space-y-4 sm:space-y-5">
        {/* ── 1. Course Info ── */}
        <CourseInfoSection
          courseCode={formData.courseCode}
          onCourseCodeChange={(v) => update("courseCode", v)}
          onSearch={handleCourseSearch}
          courseName={formData.courseName}
          creditUnits={formData.creditUnits}
          isSearching={isSearching}
          errors={errors}
        />

        {/* ── 2. Teaching Info ── */}
        <TeachingInfoSection
          degreeLevel={formData.degreeLevel}
          onDegreeLevelChange={(v) => update("degreeLevel", v)}
          lectureTime={formData.lectureTime}
          onLectureTimeChange={handleLectureTimeChange}
          labTime={formData.labTime}
          onLabTimeChange={handleLabTimeChange}
          errors={errors}
        />

        {/* ── 3. Student Type ── */}
        <StudentTypeSection
          faculty={formData.faculty}
          onFacultyChange={(v) => update("faculty", v)}
          major={formData.major}
          onMajorChange={(v) => update("major", v)}
          year={formData.year}
          onYearChange={(v) => update("year", v)}
          group={formData.group}
          onGroupChange={(v) => update("group", v)}
          enrolledStudents={formData.enrolledStudents}
          onEnrolledStudentsChange={(v) => update("enrolledStudents", v)}
          weeklyStudents={formData.weeklyStudents}
          onWeeklyStudentsChange={(v) => update("weeklyStudents", v)}
          errors={errors}
        />

        {/* ── 4. Teaching Weeks — Lecture ── */}
        <TeachingWeeksSection
          type="lecture"
          weeks={formData.lectureWeeks}
          onWeeksChange={(w) => update("lectureWeeks", w)}
          hasError={!!errors.lectureWeeks}
          errorMessage={errors.lectureWeeks}
        />

        {/* ── 5. Teaching Weeks — Lab ── */}
        <TeachingWeeksSection
          type="lab"
          weeks={formData.labWeeks}
          onWeeksChange={(w) => update("labWeeks", w)}
          hasError={!!errors.labWeeks}
          errorMessage={errors.labWeeks}
        />

        {/* ── 6. Additional ── */}
        <AdditionalSection
          attachedFile={formData.attachedFile}
          onFileChange={(f) => update("attachedFile", f)}
          notes={formData.notes}
          onNotesChange={(v) => update("notes", v)}
        />

        {/* ── Validation Errors Summary ── */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
              {isTh
                ? "กรุณาแก้ไขข้อผิดพลาดต่อไปนี้:"
                : "Please fix the following errors:"}
            </p>
            <ul className="list-inside list-disc space-y-0.5 text-sm text-red-600 dark:text-red-400">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-3">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 h-10 sm:h-12 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold text-sm sm:text-base gap-2 dark:bg-[#4a4441] dark:hover:bg-[#5a5350] dark:disabled:bg-[#3d3533] dark:text-[#f0ebe5] cursor-pointer transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{isTh ? "ยกเลิก" : "Cancel"}</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 h-10 sm:h-12 rounded-full bg-[#F27F0D] hover:bg-[#E06C00] disabled:bg-gray-400 text-white font-semibold text-sm sm:text-base gap-2 dark:bg-[#C96442] dark:hover:bg-[#B5563A] dark:disabled:bg-[#4a4441] cursor-pointer transition-colors"
          >
            <Save className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>
              {isLoading
                ? isTh
                  ? "กำลังบันทึก..."
                  : "Saving..."
                : isTh
                  ? "บันทึกข้อมูล"
                  : "Save"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}