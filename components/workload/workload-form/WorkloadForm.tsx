"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import type { SavedCourse } from "@/lib/workload/entries";
import { ConfirmationDialog } from "@/components/alerts";
import { SelectGroup } from "./SelectGroup";
import { WeeklyGrid } from "./WeeklyGrid";
import { ActionButtons } from "./ActionButtons";
import { CalendarDays, BookOpenText } from "lucide-react";

interface DayColumn {
  dayCode: string;
  dayName: string;
  courses: Array<{
    id: string;
    courseCode: string;
    courseName: string;
    time: string;
    room: string;
    studentCount: number;
    status?: 'pending' | 'approved' | 'rejected' | 'draft';
    lectureWeeks?: number[];
    labWeeks?: number[];
  }>;
}

interface WorkloadFormProps {
  onConfirm?: () => void;
  initialYear?: string;
  initialSemester?: string;
  initialEntries?: SavedCourse[];
}

function createEmptyColumns(): DayColumn[] {
  return [
    { dayCode: "sunday", dayName: "อาทิตย์", courses: [] },
    { dayCode: "monday", dayName: "จันทร์", courses: [] },
    { dayCode: "tuesday", dayName: "อังคาร", courses: [] },
    { dayCode: "wednesday", dayName: "พุธ", courses: [] },
    { dayCode: "thursday", dayName: "พฤหัสบดี", courses: [] },
    { dayCode: "friday", dayName: "ศุกร์", courses: [] },
    { dayCode: "saturday", dayName: "เสาร์", courses: [] },
  ];
}

function mapEntriesToColumns(entries: SavedCourse[]): DayColumn[] {
  return createEmptyColumns().map((column) => ({
    ...column,
    courses: entries.filter((course) => course.dayOfWeek === column.dayCode),
  }));
}

// ============================================
// Helper: Map day code to numeric value
// ============================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dayCodeToDayNumber = (dayCode: string): string => {
  const dayMap: Record<string, string> = {
    sunday: "0",
    monday: "1",
    tuesday: "2",
    wednesday: "3",
    thursday: "4",
    friday: "5",
    saturday: "6",
  };
  return dayMap[dayCode] || dayCode;
};

// ============================================
// Helper: Fetch courses from API
// ============================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchCoursesFromAPI = async (
  subjectId: string,
  year: string,
  semester: string
): Promise<DayColumn["courses"]> => {
  try {
    const response = await fetch(
      `/api/workload/course?subjectId=${encodeURIComponent(subjectId)}&year=${encodeURIComponent(year)}&semester=${encodeURIComponent(semester)}`
    );

    if (!response.ok) {
      console.error("Failed to fetch courses:", response.statusText);
      return [];
    }

    const data = await response.json() as { 
      data?: {
        subjectId: string;
        courseNameTh?: string;
        courseNameEn?: string;
        offerings?: Array<{
          sections: Array<{
            teachTableId: string;
            teachTimeStart: string;
            teachTimeEnd: string;
            room?: string;
            enrolledCount?: number;
          }>;
        }>;
      };
      error?: string;
    };

    // If API returns an error
    if (data.error) {
      console.error("API error:", data.error);
      return [];
    }

    // Map API response to course format
    const courses: DayColumn["courses"] = [];
    const courseData = data.data;

    if (courseData?.offerings) {
      courseData.offerings.forEach((offering) => {
        if (offering.sections) {
          offering.sections.forEach((section, index: number) => {
            courses.push({
              id: section.teachTableId || `${courseData.subjectId}-${index}`,
              courseCode: courseData.subjectId,
              courseName:
                (courseData.courseNameTh || courseData.courseNameEn) || "Unknown Course",
              time: `${section.teachTimeStart} - ${section.teachTimeEnd}`,
              room: section.room || "TBA",
              studentCount: section.enrolledCount || 0,
              status: "draft",
              lectureWeeks: [],
              labWeeks: [],
            });
          });
        }
      });
    }

    return courses;
  } catch (error) {
    console.error("Error fetching courses from API:", error);
    return [];
  }
};

// ============================================
// Helper: Initialize empty columns
// ============================================
const initializeEmptyColumns = (dayNames: Record<string, string>): DayColumn[] => [
  { dayCode: "sunday", dayName: dayNames.sunday, courses: [] },
  { dayCode: "monday", dayName: dayNames.monday, courses: [] },
  { dayCode: "tuesday", dayName: dayNames.tuesday, courses: [] },
  { dayCode: "wednesday", dayName: dayNames.wednesday, courses: [] },
  { dayCode: "thursday", dayName: dayNames.thursday, courses: [] },
  { dayCode: "friday", dayName: dayNames.friday, courses: [] },
  { dayCode: "saturday", dayName: dayNames.saturday, courses: [] },
];

export function WorkloadForm({
  onConfirm = () => console.log("Confirm clicked"),
  initialYear = "2569",
  initialSemester = "1",
  initialEntries = [],
}: WorkloadFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [academicYear, setAcademicYear] = useState<string>(
    () => searchParams.get("year") || initialYear,
  );
  const [semester, setSemester] = useState<string>(
    () => searchParams.get("semester") || initialSemester,
  );
  const [isGridLoading, setIsGridLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isTh = currentLanguage === "th";

  // Initialize with empty columns
  const [columns, setColumns] = useState<DayColumn[]>(() => {
    const dayNames = {
      sunday: t("WorkloadForm.sunday"),
      monday: t("WorkloadForm.monday"),
      tuesday: t("WorkloadForm.tuesday"),
      wednesday: t("WorkloadForm.wednesday"),
      thursday: t("WorkloadForm.thursday"),
      friday: t("WorkloadForm.friday"),
      saturday: t("WorkloadForm.saturday"),
    };
    return initializeEmptyColumns(dayNames);
  });

  useEffect(() => {
    const nextYear = searchParams.get("year");
    const nextSemester = searchParams.get("semester");

    if (nextYear) {
      setAcademicYear(nextYear);
    }

    if (nextSemester) {
      setSemester(nextSemester);
    }
  }, [searchParams]);

  useEffect(() => {
    let isCancelled = false;
    const matchesInitialSelection =
      academicYear === initialYear && semester === initialSemester;

    if (matchesInitialSelection) {
      setColumns(mapEntriesToColumns(initialEntries));
      setIsGridLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    const loadEntries = async () => {
      setIsGridLoading(true);

      try {
        const response = await fetch(
          `/api/workload/entries?year=${encodeURIComponent(academicYear)}&semester=${encodeURIComponent(semester)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load workload entries");
        }

        const data = (await response.json()) as { entries?: SavedCourse[] };
        const savedCourses = data.entries ?? [];

        if (isCancelled) {
          return;
        }

        setColumns(mapEntriesToColumns(savedCourses));
      } catch (error) {
        console.error("Failed to load workload entries:", error);

        if (!isCancelled) {
          setColumns(createEmptyColumns());
        }
      } finally {
        if (!isCancelled) {
          setIsGridLoading(false);
        }
      }
    };

    loadEntries();

    return () => {
      isCancelled = true;
    };
  }, [academicYear, semester, initialEntries, initialSemester, initialYear]);

  /*
  // Legacy sessionStorage-based load kept for reference.
  useEffect(() => {
    const savedCoursesStr = sessionStorage.getItem("workloadCourses");
    console.log("Checking for saved courses in sessionStorage...");

    if (savedCoursesStr) {
      try {
        const savedCourses: SavedCourse[] = JSON.parse(savedCoursesStr);
        console.log("✅ Loaded saved courses:", savedCourses);

        // Update columns with saved courses
        setColumns((prevColumns) => {
          const updatedColumns = prevColumns.map((col) => {
            const coursesToAdd = savedCourses.filter((course) => {
              const matches = course.dayOfWeek === col.dayCode;
              console.log(
                `Filtering course ${course.courseCode} (dayOfWeek=${course.dayOfWeek}) for ${col.dayCode}: ${matches}`
              );
              return matches;
            });

            return {
              ...col,
              courses: [...col.courses, ...coursesToAdd],
            };
          });
          console.log("Updated columns:", updatedColumns);
          return updatedColumns;
        });

        // Clear saved courses after loading
        sessionStorage.removeItem("workloadCourses");
      } catch (error) {
        console.error("Failed to load saved courses:", error);
      }
    } else {
      console.log("❌ No saved courses found in sessionStorage");
    }
  }, []);
  */

  const currentYear = 2569;
  const academicYearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear + i;
    const displayYear = isTh ? year : year - 543; // Convert BE to AD for English
    return { value: year.toString(), label: `${displayYear}` };
  });

  const semesterOptions = [
    { value: "1", label: isTh ? "ภาคเรียนที่ 1" : "Semester 1" },
    { value: "2", label: isTh ? "ภาคเรียนที่ 2" : "Semester 2" },
    {
      value: "3",
      label: isTh ? "ภาคเรียนที่ 3 (ฤดูร้อน)" : "Semester 3 (Summer)",
    },
  ];

  const handleAddCourse = (dayCode: string) => {
    router.push(
      `/workload/entry?day=${dayCode}&semester=${semester}&year=${academicYear}&mode=add`
    );
  };

  const handleConfirmButton = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDialog = async () => {
    setIsLoading(true);
    try {
      console.log("Confirming data:", { academicYear, semester });
      
      // Update all courses to 'pending' status
      setColumns((prevColumns) =>
        prevColumns.map((col) => ({
          ...col,
          courses: col.courses.map((course) => ({
            ...course,
            status: 'pending' as const,
          })),
        }))
      );

      // Call the onConfirm callback
      onConfirm();
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header — centered to match Figma */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          {t("WorkloadForm.title")}
        </h1>
        <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-[#8b7f77]">
          {t("WorkloadForm.subtitle")}
        </p>
      </div>

      {/* Selection Group — orange left border */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          {/* Academic Year */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
              <CalendarDays className="h-4 w-4 text-gray-500 dark:text-[#8b7f77]" />
              <span>{t("WorkloadForm.academicYear")}</span>
            </div>
            <SelectGroup
              label=""
              value={academicYear}
              onValueChange={setAcademicYear}
              options={academicYearOptions}
            />
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base  font-medium text-gray-700 dark:text-[#e8e0d8]">
              <BookOpenText className="h-4 w-4 text-gray-500 dark:text-[#8b7f77]" />
              <span>{t("WorkloadForm.semester")}</span>
            </div>
            <SelectGroup
              label=""
              value={semester}
              onValueChange={setSemester}
              options={semesterOptions}
            />
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 sm dark:border-[#4a4441] dark:bg-[#302826]">
        {isGridLoading && (
          <p className="mb-3 text-sm text-gray-500 dark:text-[#8b7f77]">
            {t("Common.loading", { defaultValue: "Loading..." })}
          </p>
        )}
        <WeeklyGrid
          columns={columns}
          semesterBadge={
            isTh
              ? `เทอม ${semester}/${academicYear}`
              : `Term ${semester}/${parseInt(academicYear) - 543}`
          }
          onAddClick={handleAddCourse}
          semester={semester}
          year={academicYear}
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons
        onConfirm={handleConfirmButton}
        isLoading={isLoading}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title={t("Alert.confirmWorkloadTitle")}
        description={`${t("Alert.confirmWorkloadLine1")} ${semester}/${academicYear}\n${t("Alert.confirmWorkloadLine2")}\n${t("Alert.confirmWorkloadLine3")}`}
        confirmText={isTh ? "ยืนยัน" : "Confirm"}
        cancelText={isTh ? "ยกเลิก" : "Cancel"}
        variant="warning"
        isLoading={isLoading}
        onConfirm={handleConfirmDialog}
        onCancel={handleCancelDialog}
      />
    </div>
  );
}
