'use client';

import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface SummaryCardProps {
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  label: string;
  count: number;
}

function SummaryCard({ iconBg, iconColor, icon, label, count }: SummaryCardProps) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <div className={`flex h-5 w-5 items-center justify-center ${iconColor}`}>{icon}</div>
      </div>
      <div className="flex min-w-0 flex-col items-start justify-center py-0">
        <div className="flex h-5 w-full items-center">
          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
        <div className="flex h-9 w-full items-center">
          <p className="text-2xl font-bold text-foreground">
            {count} {t('WorkloadHistory.countUnit')}
          </p>
        </div>
      </div>
    </div>
  );
}

interface WorkloadSummaryCardsProps {
  toEditCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function WorkloadSummaryCards({
  toEditCount,
  approvedCount,
  rejectedCount,
}: WorkloadSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        iconBg="bg-[#FEE2E2]"
        iconColor="text-[#DC2626]"
        icon={<AlertTriangle className="h-5 w-5" />}
        label={t('WorkloadHistory.toEdit')}
        count={toEditCount}
      />
      <SummaryCard
        iconBg="bg-[#D1FAE5]"
        iconColor="text-[#059669]"
        icon={<CheckCircle2 className="h-5 w-5" />}
        label={t('WorkloadHistory.approved')}
        count={approvedCount}
      />
      <SummaryCard
        iconBg="bg-[#FEE2E2]"
        iconColor="text-[#DC2626]"
        icon={<XCircle className="h-5 w-5" />}
        label={t('WorkloadHistory.rejected')}
        count={rejectedCount}
      />
    </div>
  );
}
