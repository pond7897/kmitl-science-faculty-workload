import { redirect } from 'next/navigation';
import { WorkloadHistoryContent } from '@/components/workload/history/WorkloadHistoryContent';
import { getAuthSession } from '@/lib/auth/session';
import { getWorkloadHistoriesByUserId } from '@/lib/services/workload/history.service';

export const dynamic = 'force-dynamic';

export default async function WorkloadHistoryPage() {
  const session = await getAuthSession();
  const userId = session?.userinfo?.data.id;

  if (!userId) {
    redirect('/login');
  }

  const workloadHistories = await getWorkloadHistoriesByUserId(userId);

  return <WorkloadHistoryContent histories={workloadHistories} />;
}
