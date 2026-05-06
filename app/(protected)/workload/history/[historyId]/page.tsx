import { notFound, redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth/session';
import { getWorkloadHistoryDetailById } from '@/lib/services/workload/history.service';
import { WorkloadHistoryDetailContent } from '@/components/workload/history/detail/WorkloadHistoryDetailContent';

export const dynamic = 'force-dynamic';

export default async function WorkloadHistoryDetailPage({
  params,
}: {
  params: Promise<{ historyId: string }>;
}) {
  const session = await getAuthSession();
  const userId = session?.userinfo?.data.id;

  if (!userId) {
    redirect('/login');
  }

  const { historyId } = await params;
  const detail = await getWorkloadHistoryDetailById(userId, historyId);

  if (!detail) {
    notFound();
  }

  return <WorkloadHistoryDetailContent detail={detail} />;
}
