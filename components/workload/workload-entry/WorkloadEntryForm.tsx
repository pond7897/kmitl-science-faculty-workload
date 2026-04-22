"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Trash2, Save } from "lucide-react";
import { ConfirmationDialog } from "@/components/alerts/ConfirmationDialog";
import { CourseInfoSection } from "./CourseInfoSection";
import { TeachingInfoSection } from "./TeachingInfoSection";
import { StudentTypeSection } from "./StudentTypeSection";
import {
  TeachingWeeksSection,
  buildDefaultWeeks,
} from "./TeachingWeeksSection";
import type { WeekEntry } from "./TeachingWeeksSection";
import { AdditionalSection } from "./AdditionalSection";
import type {
  WorkloadCourseLookupData,
  WorkloadCourseLookupOffering,
  WorkloadCourseLookupResponse,
  WorkloadCourseLookupSection,
} from "@/lib/types/workload";
import type { SelectOption } from "@/components/ui/AppSelect";

interface TimeRange {
  start: string;
  end: string;
}

interface EntryFormData {
  entryId?: string;
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
  enrolledStudents: string;
  weeklyStudents: string;
  lectureWeeks: WeekEntry[];
  labWeeks: WeekEntry[];
  attachedFile: File | null;
  notes: string;
  dayOfWeek?: string; // e.g., "monday", "wednesday"
}

interface LookupSelections {
  faculty: string;
  major: string;
  year: string;
  studyGroup: string;
}

interface StudyGroupOption extends SelectOption {
  enrolledStudents: string;
  weeklyStudents: string;
  lectureTime: TimeRange;
  labTime: TimeRange;
}

interface LookupOptionsState {
  faculties: SelectOption[];
  majors: SelectOption[];
  years: SelectOption[];
  studyGroups: StudyGroupOption[];
}

interface DerivedLookupState {
  options: LookupOptionsState;
  selections: LookupSelections;
  selectedGroup: StudyGroupOption | undefined;
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
  { weekNumber: 1, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 2, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 10, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 11, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 12, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 13, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 14, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 15, lockedByName: "รศ.ดร.สมชาย" },
];

const MOCK_LAB_LOCKED = [
  { weekNumber: 1, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 2, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 10, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 11, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 12, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 13, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 14, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 15, lockedByName: "รศ.ดร.สมชาย" },
];

const TOTAL_WEEKS = 15;

const EMPTY_TIME_RANGE: TimeRange = { start: "", end: "" };
const EMPTY_LOOKUP_OPTIONS: LookupOptionsState = {
  faculties: [],
  majors: [],
  years: [],
  studyGroups: [],
};

const formatTimeValue = (value: string) => value.slice(0, 5);

const isLectureSection = (section: WorkloadCourseLookupSection) =>
  section.teachingType === "ท";

const isLabSection = (section: WorkloadCourseLookupSection) =>
  section.teachingType === "ป";

const uniqueOptions = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).map((value) => ({
    value,
    label: value,
  }));

const pickSelection = (current: string, options: SelectOption[]) => {
  if (options.length === 0) return "";
  if (current && options.some((option) => option.value === current)) {
    return current;
  }
  return options.length === 1 ? options[0].value : "";
};

const buildStudyGroupOptions = (
  offerings: WorkloadCourseLookupOffering[],
): StudyGroupOption[] => {
  const options: StudyGroupOption[] = [];

  offerings.forEach((offering) => {
    const lectureSections = offering.sections.filter(isLectureSection);
    const labSections = offering.sections.filter(isLabSection);
    const matchedLabIds = new Set<string>();

    lectureSections.forEach((lectureSection, index) => {
      const matchedLab =
        labSections.find(
          (labSection) =>
            labSection.section === lectureSection.secPair ||
            labSection.secPair === lectureSection.section,
        ) ?? null;

      if (matchedLab) {
        matchedLabIds.add(matchedLab.teachTableId);
      }

      options.push({
        value: `lecture:${lectureSection.teachTableId}:${matchedLab?.teachTableId ?? "none"}`,
        label: matchedLab
          ? `กลุ่ม ${index + 1} (ทฤษฎี ${lectureSection.section} / ปฏิบัติ ${matchedLab.section})`
          : `กลุ่ม ${index + 1} (ทฤษฎี ${lectureSection.section})`,
        enrolledStudents: String(
          Math.max(lectureSection.enrolledCount, matchedLab?.enrolledCount ?? 0),
        ),
        weeklyStudents: String(
          Math.max(lectureSection.enrolledCount, matchedLab?.enrolledCount ?? 0),
        ),
        lectureTime: {
          start: formatTimeValue(lectureSection.teachTimeStart),
          end: formatTimeValue(lectureSection.teachTimeEnd),
        },
        labTime: matchedLab
          ? {
              start: formatTimeValue(matchedLab.teachTimeStart),
              end: formatTimeValue(matchedLab.teachTimeEnd),
            }
          : EMPTY_TIME_RANGE,
      });
    });

    labSections
      .filter((labSection) => !matchedLabIds.has(labSection.teachTableId))
      .forEach((labSection, index) => {
        options.push({
          value: `lab:${labSection.teachTableId}`,
          label: `กลุ่มแยก ${index + 1} (ปฏิบัติ ${labSection.section})`,
          enrolledStudents: String(labSection.enrolledCount),
          weeklyStudents: String(labSection.enrolledCount),
          lectureTime: EMPTY_TIME_RANGE,
          labTime: {
            start: formatTimeValue(labSection.teachTimeStart),
            end: formatTimeValue(labSection.teachTimeEnd),
          },
        });
      });
  });

  return options;
};

const deriveLookupState = (
  lookupData: WorkloadCourseLookupData,
  requestedSelections: LookupSelections,
): DerivedLookupState => {
  const faculties = uniqueOptions(
    lookupData.offerings.map((offering) => offering.faculty.nameTh),
  );
  const selectedFaculty = pickSelection(requestedSelections.faculty, faculties);

  const majorOfferings = lookupData.offerings.filter(
    (offering) => !selectedFaculty || offering.faculty.nameTh === selectedFaculty,
  );
  const majors = uniqueOptions(
    majorOfferings.map((offering) => offering.curriculum.nameTh),
  );
  const selectedMajor = pickSelection(requestedSelections.major, majors);

  const yearOfferings = majorOfferings.filter(
    (offering) => !selectedMajor || offering.curriculum.nameTh === selectedMajor,
  );
  const years = uniqueOptions(yearOfferings.map((offering) => offering.classYear));
  const selectedYear = pickSelection(requestedSelections.year, years);

  const studyGroupOfferings = yearOfferings.filter(
    (offering) => !selectedYear || offering.classYear === selectedYear,
  );
  const studyGroups = buildStudyGroupOptions(studyGroupOfferings);
  const selectedStudyGroup = pickSelection(
    requestedSelections.studyGroup,
    studyGroups,
  );
  const selectedGroup = studyGroups.find(
    (option) => option.value === selectedStudyGroup,
  );

  return {
    options: {
      faculties,
      majors,
      years,
      studyGroups,
    },
    selections: {
      faculty: selectedFaculty,
      major: selectedMajor,
      year: selectedYear,
      studyGroup: selectedStudyGroup,
    },
    selectedGroup,
  };
};

export function WorkloadEntryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === "th";

  const semester = searchParams.get("semester") || "1";
  const year = searchParams.get("year") || "2568";
  const dayCode = searchParams.get("day") || "";
  const entryId = searchParams.get("id") || "";
  const mode = searchParams.get("mode") || "add"; // "add" or "edit"

  const dayNameTh = dayCode ? (DAY_NAMES_TH[dayCode] ?? dayCode) : null;
  const dayNameEn = dayCode ? (DAY_NAMES_EN[dayCode] ?? dayCode) : null;

  const subtitleTh = dayNameTh
    ? `วัน${dayNameTh} ปีการศึกษา ${year} ภาคเรียนที่ ${semester}`
    : `ปีการศึกษา ${year} ภาคเรียนที่ ${semester}`;

  const subtitleEn = dayNameEn
    ? `${dayNameEn}, Academic Year ${parseInt(year) - 543}, Semester ${semester}`
    : `Academic Year ${parseInt(year) - 543}, Semester ${semester}`;

  const isEditMode = mode === "edit";
  const pageTitle = isTh 
    ? (isEditMode ? "แก้ไขข้อมูลการสอน" : "เพิ่มข้อมูลการสอน")
    : (isEditMode ? "Edit Teaching Assignment" : "Add Teaching Assignment");

  const [formData, setFormData] = useState<EntryFormData>({
    entryId: entryId || undefined,
    courseCode: "",
    courseName: "",
    creditUnits: null,
    degreeLevel: "bachelor_regular",
    lectureTime: { start: "", end: "" },
    labTime: { start: "", end: "" },
    faculty: "",
    major: "",
    year: "",
    studyGroup: "",
    enrolledStudents: "",
    weeklyStudents: "",
    lectureWeeks: buildDefaultWeeks(TOTAL_WEEKS, MOCK_LECTURE_LOCKED),
    labWeeks: buildDefaultWeeks(TOTAL_WEEKS, MOCK_LAB_LOCKED),
    attachedFile: null,
    notes: "",
    dayOfWeek: dayCode || undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedFileData, setAttachedFileData] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseLookup, setCourseLookup] = useState<WorkloadCourseLookupData | null>(
    null,
  );
  const [lookupOptions, setLookupOptions] =
    useState<LookupOptionsState>(EMPTY_LOOKUP_OPTIONS);

  const applyWeekState = useCallback((
    weeks: Partial<WeekEntry>[] | undefined,
    lockedWeeks: { weekNumber: number; lockedByName: string }[],
  ) => {
    const defaultWeeks = buildDefaultWeeks(TOTAL_WEEKS, lockedWeeks);

    if (!weeks || weeks.length === 0) {
      return defaultWeeks;
    }

    const weekMap = new Map(weeks.map((week) => [week.weekNumber, week]));

    return defaultWeeks.map((week) => {
      const restored = weekMap.get(week.weekNumber);

      if (!restored) {
        return week;
      }

      return {
        ...week,
        isSelected: restored.isSelected ?? week.isSelected,
        hasSpecialLecturer:
          restored.hasSpecialLecturer ?? week.hasSpecialLecturer,
      };
    });
  }, []);

  const applyLoadedFormData = useCallback((
    parsed: Partial<EntryFormData> & {
      attachedFileName?: string | null;
      attachedFileData?: string | null;
    },
  ) => {
    const restoredLectureWeeks = applyWeekState(
      parsed.lectureWeeks,
      MOCK_LECTURE_LOCKED,
    );
    const restoredLabWeeks = applyWeekState(parsed.labWeeks, MOCK_LAB_LOCKED);

    setFormData((prev) => ({
      ...prev,
      entryId: parsed.entryId || prev.entryId,
      courseCode: parsed.courseCode || "",
      courseName: parsed.courseName || "",
      creditUnits: parsed.creditUnits || null,
      degreeLevel: parsed.degreeLevel || "bachelor_regular",
      lectureTime: parsed.lectureTime || { start: "", end: "" },
      labTime: parsed.labTime || { start: "", end: "" },
      faculty: parsed.faculty || "",
      major: parsed.major || "",
      year: parsed.year || "",
      studyGroup: parsed.studyGroup || "",
      enrolledStudents: parsed.enrolledStudents || "",
      weeklyStudents: parsed.weeklyStudents || "",
      lectureWeeks: restoredLectureWeeks,
      labWeeks: restoredLabWeeks,
      notes: parsed.notes || "",
      dayOfWeek: dayCode || parsed.dayOfWeek || prev.dayOfWeek,
    }));

    setAttachedFileName(parsed.attachedFileName ?? null);
    setAttachedFileData(parsed.attachedFileData ?? null);
    setLookupOptions({
      faculties: parsed.faculty ? [{ value: parsed.faculty, label: parsed.faculty }] : [],
      majors: parsed.major ? [{ value: parsed.major, label: parsed.major }] : [],
      years: parsed.year ? [{ value: parsed.year, label: parsed.year }] : [],
      studyGroups: parsed.studyGroup
        ? [
            {
              value: parsed.studyGroup,
              label: parsed.studyGroup,
              enrolledStudents: parsed.enrolledStudents || "",
              weeklyStudents: parsed.weeklyStudents || "",
              lectureTime: parsed.lectureTime || EMPTY_TIME_RANGE,
              labTime: parsed.labTime || EMPTY_TIME_RANGE,
            },
          ]
        : [],
    });
  }, [applyWeekState, dayCode]);

  // โหลดข้อมูลจาก sessionStorage เมื่อกลับมาแก้ไข
  useEffect(() => {
    const storedData = sessionStorage.getItem("workloadEntryData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        applyLoadedFormData(parsed);
      } catch (error) {
        console.error("Failed to restore form data:", error);
      }
    }
  }, [applyLoadedFormData]);

  useEffect(() => {
    const hasDraftData = !!sessionStorage.getItem("workloadEntryData");

    if (!isEditMode || !entryId || hasDraftData) {
      return;
    }

    let isCancelled = false;

    const loadEntryForEdit = async () => {
      try {
        const response = await fetch(`/api/workload/entries/${encodeURIComponent(entryId)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load workload entry");
        }

        const payload = (await response.json()) as {
          data?: Partial<EntryFormData> & {
            attachedFileName?: string | null;
            attachedFileData?: string | null;
          };
        };

        if (!payload.data || isCancelled) {
          return;
        }

        applyLoadedFormData(payload.data);
      } catch (error) {
        console.error("Failed to load workload entry for edit:", error);
      }
    };

    loadEntryForEdit();

    return () => {
      isCancelled = true;
    };
  }, [applyLoadedFormData, entryId, isEditMode]);

  useEffect(() => {
    if (!courseLookup) return;

    setFormData((prev) => ({
      ...prev,
      courseName: isTh ? courseLookup.courseNameTh : courseLookup.courseNameEn,
    }));
  }, [courseLookup, isTh]);

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

  // ── Clear errors when user changes teaching weeks ──
  const handleLectureWeeksChange = (w: WeekEntry[]) => {
    setFormData((prev) => ({ ...prev, lectureWeeks: w }));
    if (errors.lectureWeeks) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.lectureWeeks;
        return next;
      });
    }
  };

  const handleLabWeeksChange = (w: WeekEntry[]) => {
    setFormData((prev) => ({ ...prev, labWeeks: w }));
    if (errors.labWeeks) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.labWeeks;
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

  const syncLookupState = (
    lookupData: WorkloadCourseLookupData,
    nextSelections: Partial<LookupSelections> = {},
  ) => {
    const requestedSelections: LookupSelections = {
      faculty: nextSelections.faculty ?? formData.faculty,
      major: nextSelections.major ?? formData.major,
      year: nextSelections.year ?? formData.year,
      studyGroup: nextSelections.studyGroup ?? formData.studyGroup,
    };
    const derivedState = deriveLookupState(lookupData, requestedSelections);

    setLookupOptions(derivedState.options);

    setFormData((prev) => ({
      ...prev,
      courseName: isTh ? lookupData.courseNameTh : lookupData.courseNameEn,
      creditUnits: lookupData.creditUnits,
      faculty: derivedState.selections.faculty,
      major: derivedState.selections.major,
      year: derivedState.selections.year,
      studyGroup: derivedState.selections.studyGroup,
      enrolledStudents: derivedState.selectedGroup?.enrolledStudents ?? "",
      weeklyStudents: derivedState.selectedGroup?.weeklyStudents ?? "",
      lectureTime: derivedState.selectedGroup?.lectureTime ?? EMPTY_TIME_RANGE,
      labTime: derivedState.selectedGroup?.labTime ?? EMPTY_TIME_RANGE,
    }));
  };

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
      const year = '2568'; // เด่ี๋ยวมาเปลี่ยน
      const semester = '1'; // เด่ี๋ยวมาเปลี่ยน

      const response = await fetch(
        `/api/workload/course?subjectId=${encodeURIComponent(formData.courseCode)}&year=${encodeURIComponent(year)}&semester=${encodeURIComponent(semester)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const result = (await response.json()) as WorkloadCourseLookupResponse;

      if (!response.ok || !("data" in result)) {
        setCourseLookup(null);
        setLookupOptions(EMPTY_LOOKUP_OPTIONS);
        setErrors((prev) => ({
          ...prev,
          courseCode:
            ("error" in result ? result.error : undefined) ||
            (isTh ? "ไม่พบรหัสวิชานี้ในระบบ" : "Course not found"),
        }));
        setFormData((prev) => ({
          ...prev,
          courseName: "",
          creditUnits: null,
          faculty: "",
          major: "",
          year: "",
          studyGroup: "",
          enrolledStudents: "",
          weeklyStudents: "",
          lectureTime: EMPTY_TIME_RANGE,
          labTime: EMPTY_TIME_RANGE,
        }));
        return;
      }

      setCourseLookup(result.data);
      syncLookupState(result.data, {
        faculty: "",
        major: "",
        year: "",
        studyGroup: "",
      });
    } catch (error) {
      console.error("Failed to search course", error);
      setCourseLookup(null);
      setLookupOptions(EMPTY_LOOKUP_OPTIONS);
      setErrors((prev) => ({
        ...prev,
        courseCode: isTh
          ? "ไม่สามารถค้นหารายวิชาได้ในขณะนี้"
          : "Unable to search course right now",
      }));
      setFormData((prev) => ({
        ...prev,
        courseName: "",
        creditUnits: null,
        faculty: "",
        major: "",
        year: "",
        studyGroup: "",
        enrolledStudents: "",
        weeklyStudents: "",
        lectureTime: EMPTY_TIME_RANGE,
        labTime: EMPTY_TIME_RANGE,
      }));
    } finally {
      setIsSearching(false);
    }
  };

  const handleFacultyChange = (value: string) => {
    if (!courseLookup) {
      update("faculty", value);
      return;
    }

    syncLookupState(courseLookup, {
      faculty: value,
      major: "",
      year: "",
      studyGroup: "",
    });
  };

  const handleMajorChange = (value: string) => {
    if (!courseLookup) {
      update("major", value);
      return;
    }

    syncLookupState(courseLookup, {
      faculty: formData.faculty,
      major: value,
      year: "",
      studyGroup: "",
    });
  };

  const handleYearChange = (value: string) => {
    if (!courseLookup) {
      update("year", value);
      return;
    }

    syncLookupState(courseLookup, {
      faculty: formData.faculty,
      major: formData.major,
      year: value,
      studyGroup: "",
    });
  };

  const handleStudyGroupChange = (value: string) => {
    if (!courseLookup) {
      update("studyGroup", value);
      return;
    }

    syncLookupState(courseLookup, {
      faculty: formData.faculty,
      major: formData.major,
      year: formData.year,
      studyGroup: value,
    });
  };

  const handleCourseCodeChange = (value: string) => {
    if (value !== formData.courseCode && courseLookup) {
      setCourseLookup(null);
      setLookupOptions(EMPTY_LOOKUP_OPTIONS);
      setFormData((prev) => ({
        ...prev,
        courseCode: value,
        courseName: "",
        creditUnits: null,
        faculty: "",
        major: "",
        year: "",
        studyGroup: "",
        enrolledStudents: "",
        weeklyStudents: "",
        lectureTime: EMPTY_TIME_RANGE,
        labTime: EMPTY_TIME_RANGE,
      }));
      return;
    }

    update("courseCode", value);
  };

  // ── Validation ─────────────────────────────────────────────
  const validateForm = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.courseCode)
      e.courseCode = isTh
        ? "รหัสวิชา: จำเป็นต้องระบุ"
        : "Course Code: Required";

    // ── Teaching weeks: at least 1 week with isSelected OR hasSpecialLecturer (excluding locked) ──
    const selectableLectureWeeks = formData.lectureWeeks.filter(
      (w) => !w.isLockedByOther,
    );
    const hasLectureWeek = selectableLectureWeeks.some(
      (w) => w.isSelected || w.hasSpecialLecturer,
    );
    if (!hasLectureWeek)
      e.lectureWeeks = isTh
        ? "สัปดาห์ที่สอน (ทฤษฎี): กรุณาเลือกสัปดาห์หรือมีวิทยากรพิเศษอย่างน้อย 1 สัปดาห์"
        : "Lecture Weeks: Please select a week or mark special lecturer for at least 1 week";

    const selectableLabWeeks = formData.labWeeks.filter(
      (w) => !w.isLockedByOther,
    );
    const hasLabWeek = selectableLabWeeks.some(
      (w) => w.isSelected || w.hasSpecialLecturer,
    );
    if (!hasLabWeek)
      e.labWeeks = isTh
        ? "สัปดาห์ที่สอน (ปฏิบัติ): กรุณาเลือกสัปดาห์หรือมีวิทยากรพิเศษอย่างน้อย 1 สัปดาห์"
        : "Lab Weeks: Please select a week or mark special lecturer for at least 1 week";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCancel = () =>
    setShowDeleteDialog(true);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      if (isEditMode && formData.entryId) {
        const response = await fetch(
          `/api/workload/entries/${encodeURIComponent(formData.entryId)}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(errorData?.error || "Failed to delete workload entry");
        }
      }

      // ลบข้อมูล draft ใน browser
      sessionStorage.removeItem("workloadEntryData");
      sessionStorage.removeItem("workloadEntryFile");
      
      // ไปหน้า workload form (ข้อมูลภาระงาน)
      router.push(`/workload/form?semester=${semester}&year=${year}`);
    } catch (error) {
      console.error("Failed to delete workload entry:", error);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Store form data WITHOUT file data to avoid localStorage quota exceeded
      const serializable = {
        ...formData,
        attachedFile: undefined, // File ไม่ serialize ได้
        attachedFileName: formData.attachedFile?.name ?? attachedFileName ?? null,
        attachedFileData: formData.attachedFile ? undefined : attachedFileData,
        academicYear: year,
        semester: semester,
      };
      sessionStorage.setItem("workloadEntryData", JSON.stringify(serializable));
      
      // Store file separately in sessionStorage with key to avoid quota issues
      if (formData.attachedFile) {
        try {
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              try {
                sessionStorage.setItem("workloadEntryFile", base64);
                resolve();
              } catch (error) {
                // If file storage fails, continue anyway - user can re-upload
                console.warn("Could not store file in sessionStorage:", error);
                resolve();
              }
            };
            reader.readAsDataURL(formData.attachedFile!);
          });
        } catch (error) {
          console.warn("Error storing file:", error);
          // Continue without file - it's not critical for preview
        }
      }
      
      router.push(`/workload/check?semester=${semester}&year=${year}${dayCode ? `&day=${dayCode}` : ""}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          {pageTitle}
        </h1>
        <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-[#8b7f77]">
          {isTh ? subtitleTh : subtitleEn}
        </p>
      </div>

      <div className="w-full space-y-4 sm:space-y-5">
        {/* ── 1. Course Info ── */}
        <CourseInfoSection
          courseCode={formData.courseCode}
          onCourseCodeChange={handleCourseCodeChange}
          onSearch={handleCourseSearch}
          courseName={formData.courseName}
          creditUnits={formData.creditUnits}
          isSearching={isSearching}
          errors={errors}
        />

        {/* ── 2. Student Type ── */}
        <StudentTypeSection
          faculty={formData.faculty}
          major={formData.major}
          year={formData.year}
          studyGroup={formData.studyGroup}
          enrolledStudents={formData.enrolledStudents}
          facultyOptions={lookupOptions.faculties}
          majorOptions={lookupOptions.majors}
          yearOptions={lookupOptions.years}
          studyGroupOptions={lookupOptions.studyGroups}
          onFacultyChange={handleFacultyChange}
          onMajorChange={handleMajorChange}
          onYearChange={handleYearChange}
          onStudyGroupChange={handleStudyGroupChange}
          onEnrolledStudentsChange={(v) => update("enrolledStudents", v)}
          disableStudentFields={!courseLookup && !isEditMode}
        />

        {/* ── 3. Teaching Info ── */}
        <TeachingInfoSection
          degreeLevel={formData.degreeLevel}
          onDegreeLevelChange={(v) => update("degreeLevel", v)}
          lectureTime={formData.lectureTime}
          onLectureTimeChange={handleLectureTimeChange}
          labTime={formData.labTime}
          onLabTimeChange={handleLabTimeChange}
          errors={errors}
        />

        {/* ── 4. Teaching Weeks — Lecture ── */}
        <TeachingWeeksSection
          type="lecture"
          weeks={formData.lectureWeeks}
          onWeeksChange={handleLectureWeeksChange}
          hasError={!!errors.lectureWeeks}
          errorMessage={errors.lectureWeeks}
        />

        {/* ── 5. Teaching Weeks — Lab ── */}
        <TeachingWeeksSection
          type="lab"
          weeks={formData.labWeeks}
          onWeeksChange={handleLabWeeksChange}
          hasError={!!errors.labWeeks}
          errorMessage={errors.labWeeks}
        />

        {/* ── 6. Additional ── */}
        <AdditionalSection
          attachedFile={formData.attachedFile}
          onFileChange={(f) => {
            update("attachedFile", f);
            // ลบชื่อไฟล์เดิมเมื่อ upload ไฟล์ใหม่
            if (f) {
              setAttachedFileName(null);
            } else {
              // ลบชื่อไฟล์เดิมเมื่อกดปุ่มลบ
              setAttachedFileName(null);
            }
          }}
          attachedFileName={attachedFileName}
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
              {Object.values(errors)
                .filter((err) => err.trim() !== "")
                .map((err, i) => (
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
            className={`flex-1 h-10 sm:h-12 rounded-full font-semibold text-sm sm:text-base gap-2 cursor-pointer transition-colors ${
              isEditMode
                ? "bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-800 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:disabled:bg-red-900/20 dark:text-red-400"
                : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 dark:bg-[#4a4441] dark:hover:bg-[#5a5350] dark:disabled:bg-[#3d3533] dark:text-[#f0ebe5]"
            }`}
          >
            {isEditMode ? (
              <>
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{isTh ? "ลบวิชา" : "Delete"}</span>
              </>
            ) : (
              <>
                <span>✕</span>
                <span>{isTh ? "ยกเลิก" : "Cancel"}</span>
              </>
            )}
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

      {/* ── Confirmation Dialog for Delete/Cancel ── */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title={isEditMode 
          ? (isTh ? "ยืนยันการลบวิชา" : "Confirm Delete")
          : (isTh ? "ยืนยันการยกเลิก" : "Confirm Cancel")
        }
        description={isEditMode
          ? (isTh 
            ? "คุณแน่ใจที่จะลบวิชานี้หรือไม่? ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้"
            : "Are you sure you want to delete this course? All data will be deleted and cannot be recovered.")
          : (isTh 
            ? "คุณแน่ใจที่จะยกเลิกการเพิ่มวิชาใหม่หรือไม่? ข้อมูลที่กรอกจะถูกลบทั้งหมด"
            : "Are you sure you want to cancel adding a new course? All entered data will be deleted.")
        }
        confirmText={isEditMode ? (isTh ? "ยืนยันการลบ" : "Delete") : (isTh ? "ยืนยันการยกเลิก" : "Cancel")}
        cancelText={isTh ? "กลับไป" : "Go Back"}
        variant={isEditMode ? "error" : "warning"}
        isLoading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
