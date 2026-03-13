import { useEffect, useState } from 'react';
import type { SubmissionStatus } from '@/components/dashboard/LatestSubmissionCard';

export interface Submission {
  id: string;
  title: string;
  status: SubmissionStatus;
  submittedAt: Date;
  teachingHours: number;
}

export interface DashboardData {
  currentHours: number;
  targetHours: number;
  lectureHours: number;
  labHours: number;
  adminHours: number;
  activeCourses: number;
  latestStatus: SubmissionStatus | null;
  recentSubmissions: Submission[];
  /** Timestamp (ms) captured when this data was fetched — used for stable relative-time display. */
  fetchedAt: number;
}

/**
 * Hook to fetch dashboard workload summary data.
 * Replace the mock timeout with a real API call when the backend is ready.
 */
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        // TODO: replace with real API call, e.g.:
        // const res = await fetch('/api/dashboard');
        // const json = await res.json();

        // ---- Mock data (remove when API is ready) ----
        await new Promise((r) => setTimeout(r, 1200));
        const now = new Date();
        const mock: DashboardData = {
          currentHours: 140,
          targetHours: 180,
          lectureHours: 112,
          labHours: 8,
          adminHours: 0,
          activeCourses: 4,
          latestStatus: 'pending',
          fetchedAt: now.getTime(),
          recentSubmissions: [
            {
              id: '1',
              title: 'ภาระงาน ปีการศึกษา 2568 ภาคเรียนที่ 1',
              status: 'pending',
              submittedAt: new Date(now.getTime() - 5 * 60 * 1000),
              teachingHours: 140,
            },
            {
              id: '2',
              title: 'ภาระงาน ปีการศึกษา 2568 ภาคเรียนที่ 1',
              status: 'processing',
              submittedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
              teachingHours: 120,
            },
            {
              id: '3',
              title: 'ภาระงาน ปีการศึกษา 2568 ภาคเรียนที่ 1',
              status: 'approved',
              submittedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
              teachingHours: 180,
            },
            {
              id: '4',
              title: 'ภาระงาน ปีการศึกษา 2567 ภาคเรียนที่ 2',
              status: 'rejected',
              submittedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
              teachingHours: 95,
            },
            {
              id: '5',
              title: 'ภาระงาน ปีการศึกษา 2567 ภาคเรียนที่ 1',
              status: 'approved',
              submittedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
              teachingHours: 60,
            },
          ],
        };
        // -----------------------------------------------

        if (!cancelled) {
          setData(mock);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
