import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getAuthSession } from "@/lib/auth/session";
import { getWorkloadEntriesForUser } from "@/lib/workload/entries";

interface TimeRange {
  start: string;
  end: string;
}

interface WeekEntry {
  weekNumber: number;
  isSelected: boolean;
  hasSpecialLecturer?: boolean;
}

interface WorkloadEntryPayload {
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
  attachedFileName?: string | null;
  attachedFileData?: string | null;
  notes?: string;
  academicYear?: string;
  semester?: string;
  dayOfWeek?: string;
}

function toInt(value: string | undefined, fallback = 0) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toGregorianYear(year: number) {
  return year > 2400 ? year - 543 : year;
}

function parseTimeToDate(year: number, time: string) {
  const [hours, minutes] = time.split(":").map((value) => Number.parseInt(value, 10));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return new Date(Date.UTC(toGregorianYear(year), 0, 1, hours, minutes, 0));
}

function calculateHours(range: TimeRange) {
  const start = parseTimeToDate(2000, range.start);
  const end = parseTimeToDate(2000, range.end);

  if (!start || !end) {
    return 0;
  }

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) {
    return 0;
  }

  return diffMs / (1000 * 60 * 60);
}

function normalizeSelectedWeeks(weeks: WeekEntry[]) {
  return weeks
    .filter((week) => week.isSelected)
    .sort((a, b) => a.weekNumber - b.weekNumber);
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  const userId = session?.userinfo?.data?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<WorkloadEntryPayload>;

  if (!payload.courseCode?.trim()) {
    return NextResponse.json({ error: "Course code is required" }, { status: 400 });
  }

  if (!payload.courseName?.trim()) {
    return NextResponse.json({ error: "Course name is required" }, { status: 400 });
  }

  const courseCode = payload.courseCode.trim();
  const courseName = payload.courseName.trim();
  const academicYear = toInt(payload.academicYear, 2569);
  const semester = toInt(payload.semester, 1);
  const enrolledStudents = toInt(payload.enrolledStudents, 0);
  const weeklyStudents = toInt(payload.weeklyStudents, enrolledStudents);
  const lectureWeeks = normalizeSelectedWeeks(payload.lectureWeeks ?? []);
  const labWeeks = normalizeSelectedWeeks(payload.labWeeks ?? []);
  const lectureHoursPerWeek = calculateHours(
    payload.lectureTime ?? { start: "", end: "" },
  );
  const labHoursPerWeek = calculateHours(payload.labTime ?? { start: "", end: "" });
  const lectureHoursUnits = Math.round(lectureHoursPerWeek);
  const labHoursUnits = Math.round(labHoursPerWeek);

  const savedSchedule = await prisma.$transaction(async (tx) => {
    const existingCourse = await tx.course.findFirst({
      where: {
        code: courseCode,
      },
    });

    const course = existingCourse
      ? await tx.course.update({
          where: { id: existingCourse.id },
          data: {
            code: courseCode,
            name: courseName,
            credits:
              payload.creditUnits != null ? String(payload.creditUnits) : existingCourse.credits,
          },
        })
      : await tx.course.create({
          data: {
            code: courseCode,
            name: courseName,
            credits: payload.creditUnits != null ? String(payload.creditUnits) : "0",
          },
        });

    const existingSection = await tx.section.findFirst({
      where: {
        courseId: course.id,
        faculty: payload.faculty?.trim() || "",
        major: payload.major?.trim() || "",
        yearLevel: payload.year?.trim() || "",
        section: payload.studyGroup?.trim() || "",
      },
    });

    const section = existingSection
      ? await tx.section.update({
          where: { id: existingSection.id },
          data: {
            studentsRegistered: enrolledStudents,
            studentsPerWeek: weeklyStudents,
          },
        })
      : await tx.section.create({
          data: {
            courseId: course.id,
            faculty: payload.faculty?.trim() || "",
            major: payload.major?.trim() || "",
            yearLevel: payload.year?.trim() || "",
            section: payload.studyGroup?.trim() || "",
            studentsRegistered: enrolledStudents,
            studentsPerWeek: weeklyStudents,
          },
        });

    const existingAcademicYear = await tx.academicYear.findFirst({
      where: {
        sectionId: section.id,
        year: academicYear,
        semester,
      },
    });

    const year = existingAcademicYear
      ? existingAcademicYear
      : await tx.academicYear.create({
          data: {
            sectionId: section.id,
            year: academicYear,
            semester,
          },
        });

    const schedule = await tx.teachingSchedule.create({
      data: {
        userId,
        yearId: year.id,
        dayOfWeek: payload.dayOfWeek?.trim() || "monday",
        degree: payload.degreeLevel?.trim() || "",
        teachingWeeksLab: labWeeks.length,
        teachingWeeksTheory: lectureWeeks.length,
        teachingWorkloadLab: Math.round(labWeeks.length * labHoursPerWeek),
        teachingWorkloadTheory: Math.round(lectureWeeks.length * lectureHoursPerWeek),
        note: payload.notes?.trim() || null,
        attachmentFileName: payload.attachedFileName?.trim() || null,
        attachmentFileData: payload.attachedFileData?.trim() || null,
      },
    });

    if (lectureWeeks.length > 0 || lectureHoursPerWeek > 0) {
      const theoryStart = parseTimeToDate(academicYear, payload.lectureTime?.start ?? "");
      const theoryEnd = parseTimeToDate(academicYear, payload.lectureTime?.end ?? "");

      if (theoryStart && theoryEnd) {
        const theory = await tx.theory.create({
          data: {
            startTime: theoryStart,
            endTime: theoryEnd,
            hoursPerWeek: lectureHoursUnits,
          },
        });

        if (lectureWeeks.length > 0) {
          await tx.teachingWeeksTheory.createMany({
            data: lectureWeeks.map((week) => ({
              scheduleId: schedule.id,
              theoryId: theory.id,
              weekNumber: week.weekNumber,
              userId,
              external: week.hasSpecialLecturer ?? false,
              pdfFile: week.hasSpecialLecturer ? payload.attachedFileName?.trim() || null : null,
            })),
          });
        }

        await tx.teachingWorkloadTheory.create({
          data: {
            scheduleId: schedule.id,
            totalWeeks: lectureWeeks.length,
            totalHours: lectureWeeks.length * lectureHoursPerWeek,
            teachingWorkload: lectureWeeks.length * lectureHoursPerWeek,
            overloadHours: 0,
            note: payload.notes?.trim() || null,
          },
        });
      }
    }

    if (labWeeks.length > 0 || labHoursPerWeek > 0) {
      const labStart = parseTimeToDate(academicYear, payload.labTime?.start ?? "");
      const labEnd = parseTimeToDate(academicYear, payload.labTime?.end ?? "");

      if (labStart && labEnd) {
        const lab = await tx.lab.create({
          data: {
            startTime: labStart,
            endTime: labEnd,
            hoursPerWeek: labHoursUnits,
          },
        });

        if (labWeeks.length > 0) {
          await tx.teachingWeeksLab.createMany({
            data: labWeeks.map((week) => ({
              scheduleId: schedule.id,
              labId: lab.id,
              weekNumber: week.weekNumber,
              userId,
              external: week.hasSpecialLecturer ?? false,
              pdfFile: week.hasSpecialLecturer ? payload.attachedFileName?.trim() || null : null,
            })),
          });
        }

        await tx.teachingWorkloadLab.create({
          data: {
            scheduleId: schedule.id,
            totalWeeks: labWeeks.length,
            totalHours: labWeeks.length * labHoursPerWeek,
            teachingWorkload: labWeeks.length * labHoursPerWeek,
            overloadHours: 0,
            note: payload.notes?.trim() || null,
          },
        });
      }
    }

    await tx.process.create({
      data: {
        scheduleId: schedule.id,
        userId,
        type: "submitted",
      },
    });

    await tx.history.create({
      data: {
        yearId: year.id,
        scheduleId: schedule.id,
      },
    });

    return schedule;
  });

  return NextResponse.json({ id: savedSchedule.id }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  const userId = session?.userinfo?.data?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const year = toInt(request.nextUrl.searchParams.get("year") ?? undefined, 2569);
  const semester = toInt(request.nextUrl.searchParams.get("semester") ?? undefined, 1);
  const entries = await getWorkloadEntriesForUser({ userId, year, semester });

  return NextResponse.json({ entries });
}
