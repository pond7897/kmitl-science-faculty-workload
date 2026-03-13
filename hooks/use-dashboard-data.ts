import { useEffect, useState } from 'react';
import type { SubmissionStatus } from '@/components/dashboard/LatestSubmissionCard';

export interface DashboardData {
  currentHours: number;
  targetHours: number;
  lectureHours: number;
  labHours: number;
  adminHours: number;
  activeCourses: number;
  latestStatus: SubmissionStatus | null;
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
        const mock: DashboardData = {
          currentHours: 140,
          targetHours: 180,
          lectureHours: 112,
          labHours: 8,
          adminHours: 0,
          activeCourses: 4,
          latestStatus: 'approved',
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
