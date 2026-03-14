import { useCallback, useEffect, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type NotificationType = 'approval' | 'rejection' | 'info' | 'reminder';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  /** Timestamp the notification was created */
  createdAt: Date;
  /** Whether the user has seen / acknowledged this notification */
  read: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call, e.g. GET /api/notifications
    const timer = setTimeout(() => {
      const now = new Date();

      const mock: AppNotification[] = [
        {
          id: 'n1',
          type: 'approval',
          title: 'อนุมัติวิทยาการพิเศษ',
          description: 'รศ.ดร.สมชาย ได้รับการอนุมัติการเชิญวิทยากร วันที่ 12 พ.ย.',
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          read: false,
        },
        {
          id: 'n2',
          type: 'approval',
          title: 'อนุมัติวิทยาการพิเศษ',
          description: 'รศ.ดร.สมชาย ได้รับการอนุมัติการเชิญวิทยากร วันที่ 12 พ.ย.',
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          read: false,
        },
        {
          id: 'n3',
          type: 'info',
          title: 'ภาระงานรอการอนุมัติ',
          description: 'คณบดีกำลังตรวจสอบภาระงานของคุณ ปีการศึกษา 2568 ภาคเรียนที่ 1',
          createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'n4',
          type: 'reminder',
          title: 'กำหนดส่งภาระงาน',
          description: 'กรุณาส่งภาระงานสำหรับปีการศึกษา 2568 ภาคเรียนที่ 2 ภายใน 7 วัน',
          createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'n5',
          type: 'rejection',
          title: 'ภาระงานไม่ผ่านการอนุมัติ',
          description: 'ภาระงานปีการศึกษา 2567 ภาคเรียนที่ 2 ไม่ผ่านการอนุมัติ กรุณาตรวจสอบ',
          createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'n6',
          type: 'approval',
          title: 'อนุมัติภาระงานสำเร็จ',
          description: 'ภาระงานปีการศึกษา 2567 ภาคเรียนที่ 1 ได้รับการอนุมัติจากคณบดีแล้ว',
          createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'n7',
          type: 'reminder',
          title: 'แจ้งเตือนการส่งภาระงาน',
          description: 'ภาระงานปีการศึกษา 2568 ภาคเรียนที่ 1 ยังไม่ได้รับการส่ง กรุณาดำเนินการ',
          createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'n8',
          type: 'info',
          title: 'อัปเดตข้อมูลระบบ',
          description: 'ระบบได้รับการอัปเดตใหม่ มีฟีเจอร์ใหม่ในการติดตามภาระงาน',
          createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          read: true,
        },
      ];

      setNotifications(mock);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // TODO: Call API to mark all as read, e.g. PUT /api/notifications/read-all
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    // TODO: Call API to mark single notification as read, e.g. PUT /api/notifications/:id/read
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, loading, markAllAsRead, markAsRead };
}
