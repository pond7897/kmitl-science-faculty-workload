"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WorkloadCheckForm } from "@/components/workload/workload-check";

interface TimeRange {
  start: string;
  end: string;
}

interface WeekEntry {
  weekNumber: number;
  isSelected: boolean;
  hasSpecialLecturer?: boolean;
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
  // attachedFile is a File object — not serializable, store name separately
  attachedFileName?: string | null;
  attachedFileData?: string | null; // Base64 encoded file data
  notes?: string;
  academicYear?: string;
  semester?: string;
  dayOfWeek?: string;
}

export default function WorkloadCheckPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<EntryFormData | null>(null);
  const dayOfWeek = searchParams.get("day") || undefined;
  const mode = searchParams.get("mode") || "add";

  useEffect(() => {
    const storedData = sessionStorage.getItem("workloadEntryData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        // attachedFile is a File (not serializable) — pull name if stored separately
        Promise.resolve().then(() => setFormData(data));
      } catch (error) {
        console.error("Failed to parse stored form data:", error);
        router.push("/workload/entry");
      }
    } else {
      router.push("/workload/entry");
    }
  }, [router]);

  const handleEdit = () => {
    // กลับไปที่ entry form พร้อม mode parameter
    const entryIdQuery = formData?.entryId ? `&id=${formData.entryId}` : "";
    router.push(
      `/workload/entry?day=${dayOfWeek}&semester=${formData?.semester || "1"}&year=${formData?.academicYear || "2568"}&mode=${mode}${entryIdQuery}`
    );
  };

  const handleConfirm = async () => {
    try {
      console.log("Form data submitted:", formData);

      if (!formData) {
        throw new Error("Missing form data");
      }

      const response = await fetch("/api/workload/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dayOfWeek: dayOfWeek || formData.dayOfWeek || "monday",
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(errorData?.error || "Failed to save workload entry");
      }

      /*
      // Legacy client-only flow kept for reference.
      // Prepare course data to add to weekly grid
      if (formData) {
        const courseData = {
          id: `course-${Date.now()}`,
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          time: `${formData.lectureTime.start} - ${formData.lectureTime.end}`,
          room: "TBD", // Could be added to form if needed
          studentCount: parseInt(formData.enrolledStudents) || 0,
          semester: formData.semester || "1", // Default semester
          year: formData.academicYear || "2568", // Default year
          dayOfWeek: dayOfWeek || formData.dayOfWeek || "monday", // Use URL param first, then form data, then default
        };

        console.log("📦 Course to save:", courseData);

        // Get existing courses from sessionStorage
        const existingCoursesStr = sessionStorage.getItem("workloadCourses");
        let existingCourses = [];
        if (existingCoursesStr) {
          try {
            existingCourses = JSON.parse(existingCoursesStr);
          } catch (e) {
            console.error("Failed to parse existing courses:", e);
          }
        }

        // Add new course
        existingCourses.push(courseData);

        // Save updated courses back to sessionStorage
        sessionStorage.setItem("workloadCourses", JSON.stringify(existingCourses));
        console.log("✅ Saved to sessionStorage. Total courses:", existingCourses.length, existingCourses);
      }
      */
      
      sessionStorage.removeItem("workloadEntryData");
      sessionStorage.removeItem("workloadEntryFile");
      router.push(
        `/workload/form?semester=${formData.semester || "1"}&year=${formData.academicYear || "2568"}`,
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-[#8b7f77]">Loading...</p>
      </div>
    );
  }

  return (
    <WorkloadCheckForm
      courseCode={formData.courseCode}
      courseName={formData.courseName}
      creditUnits={formData.creditUnits}
      degreeLevel={formData.degreeLevel}
      lectureTime={formData.lectureTime}
      labTime={formData.labTime}
      faculty={formData.faculty}
      major={formData.major}
      year={formData.year}
      studyGroup={formData.studyGroup}
      enrolledStudents={formData.enrolledStudents}
      weeklyStudents={formData.weeklyStudents}
      lectureWeeks={formData.lectureWeeks}
      labWeeks={formData.labWeeks}
      attachedFileName={formData.attachedFileName}
      attachedFileData={formData.attachedFileData}
      notes={formData.notes}
      academicYear={formData.academicYear}
      semester={formData.semester}
      dayOfWeek={formData.dayOfWeek}
      onEdit={handleEdit}
      onConfirm={handleConfirm}
    />
  );
}
