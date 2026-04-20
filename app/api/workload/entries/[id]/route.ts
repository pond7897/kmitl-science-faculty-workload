import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/auth/prisma";

function formatTime(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(11, 16);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAuthSession();
  const userId = session?.userinfo?.data?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const schedule = await prisma.teachingSchedule.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      dayOfWeek: true,
      degree: true,
      note: true,
      attachmentFileName: true,
      attachmentFileData: true,
      year: {
        select: {
          year: true,
          semester: true,
          section: {
            select: {
              yearLevel: true,
              section: true,
              faculty: true,
              major: true,
              studentsRegistered: true,
              studentsPerWeek: true,
              course: true,
            },
          },
        },
      },
      theoryWeeks: {
        select: {
          weekNumber: true,
          external: true,
          theory: true,
        },
        orderBy: {
          weekNumber: "asc",
        },
      },
      labWeeks: {
        select: {
          weekNumber: true,
          external: true,
          lab: true,
        },
        orderBy: {
          weekNumber: "asc",
        },
      },
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const course = schedule.year.section.course;
  const section = schedule.year.section;
  const firstTheory = schedule.theoryWeeks[0]?.theory;
  const firstLab = schedule.labWeeks[0]?.lab;

  return NextResponse.json({
    data: {
      entryId: schedule.id,
      courseCode: course.code ?? "",
      courseName: course.name,
      creditUnits: Number.parseInt(course.credits, 10) || null,
      degreeLevel: schedule.degree,
      lectureTime: {
        start: formatTime(firstTheory?.startTime),
        end: formatTime(firstTheory?.endTime),
      },
      labTime: {
        start: formatTime(firstLab?.startTime),
        end: formatTime(firstLab?.endTime),
      },
      faculty: section.faculty,
      major: section.major,
      year: section.yearLevel,
      studyGroup: section.section,
      enrolledStudents: String(section.studentsRegistered),
      weeklyStudents: String(section.studentsPerWeek),
      lectureWeeks: schedule.theoryWeeks.map((week) => ({
        weekNumber: week.weekNumber,
        isSelected: !week.external,
        hasSpecialLecturer: week.external,
      })),
      labWeeks: schedule.labWeeks.map((week) => ({
        weekNumber: week.weekNumber,
        isSelected: !week.external,
        hasSpecialLecturer: week.external,
      })),
      attachedFileName: schedule.attachmentFileName,
      attachedFileData: schedule.attachmentFileData,
      notes: schedule.note ?? "",
      academicYear: String(schedule.year.year),
      semester: String(schedule.year.semester),
      dayOfWeek: schedule.dayOfWeek,
    },
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAuthSession();
  const userId = session?.userinfo?.data?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const schedule = await prisma.teachingSchedule.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      yearId: true,
      year: {
        select: {
          sectionId: true,
          section: {
            select: {
              courseId: true,
            },
          },
        },
      },
      theoryWeeks: {
        select: {
          id: true,
          theoryId: true,
        },
      },
      labWeeks: {
        select: {
          id: true,
          labId: true,
        },
      },
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const theoryIds = Array.from(
    new Set(schedule.theoryWeeks.map((week) => week.theoryId)),
  );
  const labIds = Array.from(new Set(schedule.labWeeks.map((week) => week.labId)));
  const sectionId = schedule.year.sectionId;
  const courseId = schedule.year.section.courseId;
  const yearId = schedule.yearId;

  await prisma.$transaction(async (tx) => {
    await tx.history.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await tx.process.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await tx.teachingWorkloadTheory.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await tx.teachingWorkloadLab.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await tx.teachingWeeksTheory.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await tx.teachingWeeksLab.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await tx.teachingSchedule.delete({
      where: {
        id: schedule.id,
      },
    });

    if (theoryIds.length > 0) {
      await tx.theory.deleteMany({
        where: {
          id: {
            in: theoryIds,
          },
          weeks: {
            none: {},
          },
        },
      });
    }

    if (labIds.length > 0) {
      await tx.lab.deleteMany({
        where: {
          id: {
            in: labIds,
          },
          weeks: {
            none: {},
          },
        },
      });
    }

    const remainingSchedulesForYear = await tx.teachingSchedule.count({
      where: {
        yearId,
      },
    });
    const remainingHistoryForYear = await tx.history.count({
      where: {
        yearId,
      },
    });

    if (remainingSchedulesForYear === 0 && remainingHistoryForYear === 0) {
      await tx.academicYear.delete({
        where: {
          id: yearId,
        },
      });
    }

    const remainingAcademicYearsForSection = await tx.academicYear.count({
      where: {
        sectionId,
      },
    });

    if (remainingAcademicYearsForSection === 0) {
      await tx.section.delete({
        where: {
          id: sectionId,
        },
      });
    }

    const remainingSectionsForCourse = await tx.section.count({
      where: {
        courseId,
      },
    });

    if (remainingSectionsForCourse === 0) {
      await tx.course.delete({
        where: {
          id: courseId,
        },
      });
    }
  });

  return NextResponse.json({ success: true });
}
