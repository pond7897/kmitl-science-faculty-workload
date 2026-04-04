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
      const submittedAt =
        history.schedule.processes.find((process) => process.type === 'submitted')?.createdAt ??
        history.schedule.processes.at(-1)?.createdAt ??
        new Date();

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
