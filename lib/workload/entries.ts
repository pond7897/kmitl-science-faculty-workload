import { prisma } from "@/lib/auth/prisma";

export interface SavedCourse {
  id: string;
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  studentCount: number;
  dayOfWeek: string;
  semester: string;
  year: string;
  status?: "pending" | "approved" | "rejected" | "draft";
  lectureWeeks?: number[];
  labWeeks?: number[];
}

function formatTime(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(11, 16);
}

function mapProcessToStatus(type?: string): SavedCourse["status"] {
  switch (type) {
    case "submitted":
      return "pending";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "draft":
    default:
      return "draft";
  }
}

export async function getWorkloadEntriesForUser(params: {
  userId: string;
  year: number;
  semester: number;
}): Promise<SavedCourse[]> {
  const schedules = await prisma.teachingSchedule.findMany({
    where: {
      userId: params.userId,
      year: {
        year: params.year,
        semester: params.semester,
      },
    },
    select: {
      id: true,
      dayOfWeek: true,
      year: {
        select: {
          year: true,
          semester: true,
          section: {
            select: {
              studentsRegistered: true,
              course: true,
            },
          },
        },
      },
      theoryWeeks: {
        select: {
          weekNumber: true,
          theory: true,
        },
        orderBy: {
          weekNumber: "asc",
        },
      },
      labWeeks: {
        select: {
          weekNumber: true,
          lab: true,
        },
        orderBy: {
          weekNumber: "asc",
        },
      },
      processes: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  return schedules.map((schedule) => {
    const course = schedule.year.section.course;
    const section = schedule.year.section;
    const theory = schedule.theoryWeeks[0]?.theory;
    const lab = schedule.labWeeks[0]?.lab;
    const theoryTime =
      theory != null ? `${formatTime(theory.startTime)} - ${formatTime(theory.endTime)}` : "";
    const labTime = lab != null ? `${formatTime(lab.startTime)} - ${formatTime(lab.endTime)}` : "";
    const time = [theoryTime, labTime].filter(Boolean).join(" / ");

    return {
      id: schedule.id,
      courseCode: course.code ?? "",
      courseName: course.name,
      time: time || "TBD",
      room: "TBD",
      studentCount: section.studentsRegistered,
      dayOfWeek: schedule.dayOfWeek,
      semester: String(schedule.year.semester),
      year: String(schedule.year.year),
      status: mapProcessToStatus(schedule.processes[0]?.type),
      lectureWeeks: schedule.theoryWeeks.map((week) => week.weekNumber),
      labWeeks: schedule.labWeeks.map((week) => week.weekNumber),
    };
  });
}
