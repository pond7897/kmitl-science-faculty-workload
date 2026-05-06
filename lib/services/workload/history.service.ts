import { prisma } from '@/lib/auth/prisma';
import type { ProcessType } from '@/lib/generated/prisma/client';

export type WorkloadStatus =
  | 'pendingDepartment'
  | 'pendingDean'
  | 'needsRevision'
  | 'rejected'
  | 'resubmitted'
  | 'approved';

export interface WorkloadHistoryServiceItem {
  id: string;
  semester: string;
  year: string;
  title: string;
  status: WorkloadStatus;
  submittedAt: string;
  hasDepartmentApproved: boolean;
}

export interface WorkloadHistorySessionSlot {
  startTime: string;
  endTime: string;
  hoursPerWeek: number | null;
}

export interface WorkloadHistoryWeekItem {
  id: string;
  weekNumber: number;
  external: boolean;
  pdfFile: string | null;
  instructorName: string | null;
}

export interface WorkloadHistoryProcessItem {
  id: string;
  type: ProcessType;
  createdAt: string;
  actorName: string | null;
}

export interface WorkloadHistoryDetailServiceItem {
  id: string;
  semester: string;
  year: string;
  title: string;
  status: WorkloadStatus;
  submittedAt: string;
  hasDepartmentApproved: boolean;
  dayOfWeek: string;
  degree: string;
  courseName: string;
  courseCode: string;
  credits: string;
  faculty: string;
  major: string;
  yearLevel: string;
  section: string;
  studentsRegistered: number;
  studentsPerWeek: number;
  expectedTheoryWeeks: number;
  expectedLabWeeks: number;
  theorySessions: WorkloadHistorySessionSlot[];
  labSessions: WorkloadHistorySessionSlot[];
  totalTheoryHours: number | null;
  totalLabHours: number | null;
  theoryWeeks: WorkloadHistoryWeekItem[];
  labWeeks: WorkloadHistoryWeekItem[];
  processes: WorkloadHistoryProcessItem[];
}

function mapStatusFromProcesses(
  processes: Array<{ type: ProcessType }>,
): WorkloadStatus {
  if (processes.length === 0) {
    return 'pendingDepartment';
  }

  const latestType = processes.at(-1)?.type;
  const approvedCount = processes.filter((process) => process.type === 'approved').length;
  const hasRejected = processes.some((process) => process.type === 'rejected');

  if (latestType === 'rejected') {
    return approvedCount > 0 ? 'rejected' : 'needsRevision';
  }

  if (latestType === 'approved') {
    return 'approved';
  }

  if (latestType === 'submitted') {
    if (hasRejected) {
      return 'resubmitted';
    }

    if (approvedCount > 0) {
      return 'pendingDean';
    }

    return 'pendingDepartment';
  }

  return 'pendingDepartment';
}

function getSubmittedAt(processes: Array<{ type: ProcessType; createdAt: Date }>) {
  return (
    processes.find((process) => process.type === 'submitted')?.createdAt ??
    processes.at(-1)?.createdAt ??
    new Date()
  );
}

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Bangkok',
});

function formatTime(date: Date) {
  return timeFormatter.format(date);
}

function getSessionSlots<T extends { startTime: Date; endTime: Date; hoursPerWeek: number }>(
  sessions: T[],
): WorkloadHistorySessionSlot[] {
  const uniqueSlots = new Map<string, WorkloadHistorySessionSlot>();

  for (const session of sessions) {
    const slot: WorkloadHistorySessionSlot = {
      startTime: formatTime(session.startTime),
      endTime: formatTime(session.endTime),
      hoursPerWeek: session.hoursPerWeek ?? null,
    };

    const key = `${slot.startTime}-${slot.endTime}-${slot.hoursPerWeek ?? 'na'}`;
    uniqueSlots.set(key, slot);
  }

  return [...uniqueSlots.values()];
}

function getDisplayName(
  user:
    | {
        firstname_th: string | null;
        lastname_th: string | null;
        firstname_en: string | null;
        lastname_en: string | null;
        name: string | null;
        email: string;
      }
    | null
    | undefined,
) {
  if (!user) {
    return null;
  }

  const thaiName = [user.firstname_th, user.lastname_th].filter(Boolean).join(' ').trim();
  if (thaiName) {
    return thaiName;
  }

  const englishName = [user.firstname_en, user.lastname_en].filter(Boolean).join(' ').trim();
  if (englishName) {
    return englishName;
  }

  return user.name?.trim() || user.email;
}

export async function getWorkloadHistoriesByUserId(
  userId: string,
): Promise<WorkloadHistoryServiceItem[]> {
  const histories = await prisma.history.findMany({
    where: {
      schedule: {
        userId,
      },
    },
    include: {
      year: {
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      },
      schedule: {
        select: {
          degree: true,
          processes: {
            select: {
              type: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      },
    },
  });

  return histories
    .map((history) => {
      const submittedAt = getSubmittedAt(history.schedule.processes);

      return {
        id: history.id,
        semester: String(history.year.semester),
        year: String(history.year.year),
        title: [
          history.year.section.course.name,
          history.schedule.degree,
          history.year.section.major,
          `หมู่เรียน ${history.year.section.section}`,
        ].join(' '),
        status: mapStatusFromProcesses(history.schedule.processes),
        submittedAt: submittedAt.toISOString(),
        hasDepartmentApproved: history.schedule.processes.some((process) => process.type === 'approved'),
      };
    })
    .sort((a, b) => {
      const yearDiff = Number(b.year) - Number(a.year);
      if (yearDiff !== 0) {
        return yearDiff;
      }

      const semesterDiff = Number(b.semester) - Number(a.semester);
      if (semesterDiff !== 0) {
        return semesterDiff;
      }

      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
}

export async function getWorkloadHistoryDetailById(
  userId: string,
  historyId: string,
): Promise<WorkloadHistoryDetailServiceItem | null> {
  const history = await prisma.history.findFirst({
    where: {
      id: historyId,
      schedule: {
        userId,
      },
    },
    include: {
      year: {
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      },
      schedule: {
        include: {
          processes: {
            include: {
              user: {
                select: {
                  email: true,
                  name: true,
                  firstname_th: true,
                  lastname_th: true,
                  firstname_en: true,
                  lastname_en: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          theoryWeeks: {
            include: {
              theory: true,
              user: {
                select: {
                  email: true,
                  name: true,
                  firstname_th: true,
                  lastname_th: true,
                  firstname_en: true,
                  lastname_en: true,
                },
              },
            },
            orderBy: {
              weekNumber: 'asc',
            },
          },
          labWeeks: {
            include: {
              lab: true,
              user: {
                select: {
                  email: true,
                  name: true,
                  firstname_th: true,
                  lastname_th: true,
                  firstname_en: true,
                  lastname_en: true,
                },
              },
            },
            orderBy: {
              weekNumber: 'asc',
            },
          },
          workloadLab: true,
          workloadTheo: true,
        },
      },
    },
  });

  if (!history) {
    return null;
  }

  const submittedAt = getSubmittedAt(history.schedule.processes);

  return {
    id: history.id,
    semester: String(history.year.semester),
    year: String(history.year.year),
    title: [
      history.year.section.course.name,
      history.schedule.degree,
      history.year.section.major,
      `หมู่เรียน ${history.year.section.section}`,
    ].join(' '),
    status: mapStatusFromProcesses(history.schedule.processes),
    submittedAt: submittedAt.toISOString(),
    hasDepartmentApproved: history.schedule.processes.some((process) => process.type === 'approved'),
    dayOfWeek: history.schedule.dayOfWeek,
    degree: history.schedule.degree,
    courseName: history.year.section.course.name,
    courseCode: history.year.section.course.id,
    credits: history.year.section.course.credits,
    faculty: history.year.section.faculty,
    major: history.year.section.major,
    yearLevel: history.year.section.yearLevel,
    section: history.year.section.section,
    studentsRegistered: history.year.section.studentsRegistered,
    studentsPerWeek: history.year.section.studentsPerWeek,
    expectedTheoryWeeks: history.schedule.teachingWeeksTheory,
    expectedLabWeeks: history.schedule.teachingWeeksLab,
    theorySessions: getSessionSlots(history.schedule.theoryWeeks.map((week) => week.theory)),
    labSessions: getSessionSlots(history.schedule.labWeeks.map((week) => week.lab)),
    totalTheoryHours: history.schedule.workloadTheo?.totalHours ?? null,
    totalLabHours: history.schedule.workloadLab?.totalHours ?? null,
    theoryWeeks: history.schedule.theoryWeeks.map((week) => ({
      id: week.id,
      weekNumber: week.weekNumber,
      external: week.external,
      pdfFile: week.pdfFile,
      instructorName: getDisplayName(week.user),
    })),
    labWeeks: history.schedule.labWeeks.map((week) => ({
      id: week.id,
      weekNumber: week.weekNumber,
      external: week.external,
      pdfFile: week.pdfFile,
      instructorName: getDisplayName(week.user),
    })),
    processes: history.schedule.processes.map((process) => ({
      id: process.id,
      type: process.type,
      createdAt: process.createdAt.toISOString(),
      actorName: getDisplayName(process.user),
    })),
  };
}
