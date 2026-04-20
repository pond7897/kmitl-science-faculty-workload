'use server';

import { WorkloadForm } from '@/components/workload';
import { getAuthSession } from '@/lib/auth/session';
import { getWorkloadEntriesForUser } from '@/lib/workload/entries';

interface WorkloadFormPageProps {
  searchParams?: Promise<{
    year?: string;
    semester?: string;
  }>;
}

export default async function WorkloadFormPage({
  searchParams,
}: WorkloadFormPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const initialYear = resolvedSearchParams.year || '2569';
  const initialSemester = resolvedSearchParams.semester || '1';
  const session = await getAuthSession();
  const userId = session?.userinfo?.data?.id;
  const initialEntries = userId
    ? await getWorkloadEntriesForUser({
        userId,
        year: Number.parseInt(initialYear, 10) || 2569,
        semester: Number.parseInt(initialSemester, 10) || 1,
      })
    : [];

  return (
    <WorkloadForm
      initialYear={initialYear}
      initialSemester={initialSemester}
      initialEntries={initialEntries}
    />
  );
}
