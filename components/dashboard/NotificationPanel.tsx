'use client';

import { useTranslation } from 'react-i18next';
import { UserPlus, Info, Bell, AlertTriangle, BellOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { AppNotification, NotificationType } from '@/hooks/use-notifications';

// ─── Icon config per type ────────────────────────────────────────────────────

const iconConfig: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  approval: {
    icon: UserPlus,
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    color: 'text-orange-500 dark:text-orange-400',
  },
  rejection: {
    icon: AlertTriangle,
    bg: 'bg-red-100 dark:bg-red-900/30',
    color: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    color: 'text-blue-600 dark:text-blue-400',
  },
  reminder: {
    icon: Bell,
    bg: 'bg-green-100 dark:bg-green-900/30',
    color: 'text-green-600 dark:text-green-400',
  },
};

// ─── Relative time helper ────────────────────────────────────────────────────

function formatRelativeTime(date: Date, nowMs: number, locale: string): string {
  const isTh = locale === 'th-TH';
  const diffMs = nowMs - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return isTh ? `${diffSec} วินาทีที่แล้ว` : `${diffSec}s ago`;
  if (diffMin < 60) return isTh ? `${diffMin} นาทีที่แล้ว` : `${diffMin}m ago`;
  if (diffHour < 24) return isTh ? `${diffHour} ชม. ที่แล้ว` : `${diffHour} hr. ago`;
  if (diffDay === 1) return isTh ? 'เมื่อวาน' : 'Yesterday';
  if (diffDay < 7) return isTh ? `${diffDay} วันที่แล้ว` : `${diffDay} days ago`;
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SkeletonNotification() {
  return (
    <li className="flex items-start gap-3 p-3 sm:p-3 rounded-xl">
      <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </li>
  );
}

interface NotificationItemProps {
  notification: AppNotification;
  nowMs: number;
  locale: string;
  onRead: (id: string) => void;
}

function NotificationItem({ notification, nowMs, locale, onRead }: NotificationItemProps) {
  const { t } = useTranslation();
  const cfg = iconConfig[notification.type];
  const Icon = cfg.icon;
  const relTime = formatRelativeTime(notification.createdAt, nowMs, locale);

  return (
    <li
      className={cn(
        'flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-colors cursor-pointer',
        'bg-[#F8F7F5] dark:bg-white/5',
        notification.read
          ? 'hover:bg-gray-100 dark:hover:bg-white/10'
          : 'ring-1 ring-orange-200/60 dark:ring-orange-800/40 hover:bg-orange-50 dark:hover:bg-orange-900/20',
      )}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0',
          cfg.bg,
        )}
      >
        <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', cfg.color)} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-elder-xs sm:text-sm leading-snug',
              notification.read
                ? 'text-gray-700 dark:text-gray-300 font-normal'
                : 'text-gray-900 dark:text-white font-semibold',
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="shrink-0 mt-0.5 inline-flex items-center rounded-full bg-[#FEF2E7] dark:bg-orange-900/40 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-[#F27F0D] dark:text-orange-400 border border-orange-200 dark:border-orange-800 leading-none">
              {t('Notifications.new')}
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
          {notification.description}
        </p>
        <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 mt-1 sm:mt-1.5 font-medium">
          {relTime}
        </p>
      </div>
    </li>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyNotifications() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-2 sm:gap-3 text-center">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
        <BellOff className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-elder-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
        {t('Notifications.empty')}
      </p>
      <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">
        {t('Notifications.emptyHint')}
      </p>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface NotificationPanelProps {
  notifications: AppNotification[];
  unreadCount: number;
  loading?: boolean;
  nowMs: number;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  nowMs,
  onMarkAllAsRead,
  onMarkAsRead,
}: NotificationPanelProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'th' ? 'th-TH' : 'en-US';

  return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden max-h-130 sm:max-h-150 lg:max-h-192">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 sm:px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-elder-base sm:text-elder-lg font-bold text-gray-700 dark:text-gray-200">
            {t('Notifications.title')}
          </h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 sm:min-w-5.5 sm:h-5.5 rounded-full bg-[#F27F0D] text-white text-[10px] sm:text-[11px] font-bold px-1.5 leading-none shadow-sm shadow-orange-200/50">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] sm:text-xs font-semibold text-[#F27F0D] hover:text-[#E06C00] dark:text-orange-400 dark:hover:text-orange-300 transition-colors cursor-pointer"
          >
            {t('Notifications.clearAll')}
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-gray-100 dark:bg-gray-700 shrink-0" />

      {/* ── Scrollable list ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-1.5 sm:px-2 py-2">
        {loading ? (
          <ul className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonNotification key={i} />
            ))}
          </ul>
        ) : notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                nowMs={nowMs}
                locale={locale}
                onRead={onMarkAsRead}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
