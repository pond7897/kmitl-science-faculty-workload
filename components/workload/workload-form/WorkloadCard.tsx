"use client";

import { Clock, MapPin, Users, Pen, AlertCircle, CheckCircle, Clock as ClockIcon, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkloadCardProps {
  id?: string;
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  studentCount: number;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  status?: 'pending' | 'approved' | 'rejected' | 'returned' | 'draft';
  day?: string;
  semester?: string;
  year?: string;
  /** Array of selected lecture week numbers (1–15) */
  lectureWeeks?: number[];
  /** Array of selected lab week numbers (1–15) */
  labWeeks?: number[];
}

type StatusConfig = {
  label: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
  cardBgColor: string;
  cardBorderColor: string;
  cardBorderLeftColor: string;
  codeTxtColor: string;
  buttonBgColor: string;
  buttonBorderColor: string;
  buttonTextColor: string;
  weekActiveBg: string;
  weekActiveText: string;
  weekInactiveBg: string;
  dividerColor: string;
};

const statusConfig: Record<'pending' | 'approved' | 'rejected' | 'returned' | 'draft', StatusConfig> = {
  draft: {
    label: 'ยังไม่เลือกสัปดาห์สอน',
    bgColor: 'bg-blue-100/50 dark:bg-blue-500/10',
    textColor: 'text-blue-700 dark:text-blue-300',
    icon: <ClockIcon className="h-3.5 w-3.5" />,
    cardBgColor: 'bg-blue-50 dark:bg-blue-500/5',
    cardBorderColor: 'border-blue-200 dark:border-blue-500/25',
    cardBorderLeftColor: 'border-l-blue-500 dark:border-l-blue-400',
    codeTxtColor: 'text-blue-600 dark:text-blue-300',
    buttonBgColor: 'bg-blue-100/70 hover:bg-blue-100 active:bg-blue-200 dark:bg-blue-500/10 dark:hover:bg-blue-500/15 dark:active:bg-blue-500/25',
    buttonBorderColor: 'border-blue-300 dark:border-blue-400/30',
    buttonTextColor: 'text-blue-600 dark:text-blue-400',
    weekActiveBg: 'bg-blue-500 dark:bg-blue-400',
    weekActiveText: 'text-white',
    weekInactiveBg: 'bg-blue-100 dark:bg-blue-500/10',
    dividerColor: 'border-blue-200 dark:border-blue-400/15',
  },
  pending: {
    label: 'รออนุมัติ',
    bgColor: 'bg-orange-100/50 dark:bg-orange-500/10',
    textColor: 'text-orange-700 dark:text-orange-300',
    icon: <ClockIcon className="h-3.5 w-3.5" />,
    cardBgColor: 'bg-orange-50 dark:bg-orange-500/5',
    cardBorderColor: 'border-orange-200 dark:border-orange-500/25',
    cardBorderLeftColor: 'border-l-orange-500 dark:border-l-orange-400',
    codeTxtColor: 'text-orange-600 dark:text-orange-300',
    buttonBgColor: 'bg-orange-100/70 hover:bg-orange-100 active:bg-orange-200 dark:bg-orange-500/10 dark:hover:bg-orange-500/15 dark:active:bg-orange-500/25',
    buttonBorderColor: 'border-orange-300 dark:border-orange-400/30',
    buttonTextColor: 'text-orange-600 dark:text-orange-400',
    weekActiveBg: 'bg-[#F27F0D] dark:bg-[#C96442]',
    weekActiveText: 'text-white',
    weekInactiveBg: 'bg-orange-100/60 dark:bg-orange-500/10',
    dividerColor: 'border-orange-200 dark:border-orange-400/15',
  },
  approved: {
    label: 'อนุมัติ',
    bgColor: 'bg-green-100/50 dark:bg-green-500/10',
    textColor: 'text-green-700 dark:text-green-300',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    cardBgColor: 'bg-green-50 dark:bg-green-500/5',
    cardBorderColor: 'border-green-200 dark:border-green-500/25',
    cardBorderLeftColor: 'border-l-green-500 dark:border-l-green-400',
    codeTxtColor: 'text-green-600 dark:text-green-300',
    buttonBgColor: 'bg-green-100/70 hover:bg-green-100 active:bg-green-200 dark:bg-green-500/10 dark:hover:bg-green-500/15 dark:active:bg-green-500/25',
    buttonBorderColor: 'border-green-300 dark:border-green-400/30',
    buttonTextColor: 'text-green-600 dark:text-green-400',
    weekActiveBg: 'bg-green-500 dark:bg-green-400',
    weekActiveText: 'text-white',
    weekInactiveBg: 'bg-green-100/60 dark:bg-green-500/10',
    dividerColor: 'border-green-200 dark:border-green-400/15',
  },
  rejected: {
    label: 'ไม่อนุมัติ',
    bgColor: 'bg-red-100/50 dark:bg-red-500/10',
    textColor: 'text-red-700 dark:text-red-300',
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    cardBgColor: 'bg-red-50 dark:bg-red-500/5',
    cardBorderColor: 'border-red-200 dark:border-red-500/25',
    cardBorderLeftColor: 'border-l-red-500 dark:border-l-red-400',
    codeTxtColor: 'text-red-600 dark:text-red-300',
    buttonBgColor: 'bg-red-100/70 hover:bg-red-100 active:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/15 dark:active:bg-red-500/25',
    buttonBorderColor: 'border-red-300 dark:border-red-400/30',
    buttonTextColor: 'text-red-600 dark:text-red-400',
    weekActiveBg: 'bg-red-500 dark:bg-red-400',
    weekActiveText: 'text-white',
    weekInactiveBg: 'bg-red-100/60 dark:bg-red-500/10',
    dividerColor: 'border-red-200 dark:border-red-400/15',
  },
  returned: {
    label: 'ส่งกลับมาแล้ว',
    bgColor: 'bg-purple-100/50 dark:bg-purple-500/10',
    textColor: 'text-purple-700 dark:text-purple-300',
    icon: <Undo2 className="h-3.5 w-3.5" />,
    cardBgColor: 'bg-purple-50 dark:bg-purple-500/5',
    cardBorderColor: 'border-purple-200 dark:border-purple-500/25',
    cardBorderLeftColor: 'border-l-purple-500 dark:border-l-purple-400',
    codeTxtColor: 'text-purple-600 dark:text-purple-300',
    buttonBgColor: 'bg-purple-100/70 hover:bg-purple-100 active:bg-purple-200 dark:bg-purple-500/10 dark:hover:bg-purple-500/15 dark:active:bg-purple-500/25',
    buttonBorderColor: 'border-purple-300 dark:border-purple-400/30',
    buttonTextColor: 'text-purple-600 dark:text-purple-400',
    weekActiveBg: 'bg-purple-500 dark:bg-purple-400',
    weekActiveText: 'text-white',
    weekInactiveBg: 'bg-purple-100/60 dark:bg-purple-500/10',
    dividerColor: 'border-purple-200 dark:border-purple-400/15',
  },
};

const TOTAL_WEEKS = 15;

// ─────────────────────────────────────────────────────────
// WeekMiniGrid — แสดง 15 ช่องสัปดาห์ขนาดเล็ก (DEPRECATED - use WeekSelectionGrid)
// ─────────────────────────────────────────────────────────
function WeekMiniGrid({
  label,
  selectedWeeks,
  activeBg,
  activeText,
  inactiveBg,
}: {
  label: string;
  selectedWeeks: number[];
  activeBg: string;
  activeText: string;
  inactiveBg: string;
}) {
  const selectedSet = new Set(selectedWeeks);
  const hasAny = selectedWeeks.length > 0;

  return (
    <div className="space-y-1">
      {/* Row label + count */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </span>
        {hasAny && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeBg} ${activeText}`}>
            {selectedWeeks.length}/{TOTAL_WEEKS}
          </span>
        )}
      </div>

      {/* 15 week cells */}
      <div className="flex gap-0.75">
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
          const week = i + 1;
          const isActive = selectedSet.has(week);
          return (
            <div
              key={week}
              title={`สัปดาห์ ${week}`}
              className={[
                "flex-1 h-3.5 rounded-[3px] transition-all duration-200",
                isActive
                  ? `${activeBg} shadow-sm`
                  : inactiveBg,
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* Week number labels — only first, middle, last */}
      <div className="flex justify-between px-px">
        <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">1</span>
        <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">8</span>
        <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">15</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// WorkloadCard — Main Export
// ─────────────────────────────────────────────────────────
export function WorkloadCard({
  id,
  courseCode,
  courseName,
  time,
  room,
  studentCount,
  status = 'draft',
  day = 'monday',
  semester = '1',
  year = '2569',
  lectureWeeks = [],
  labWeeks = [],
}: WorkloadCardProps) {
  const router = useRouter();
  // Fallback to 'draft' if status is not found in statusConfig
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  const handleEdit = () => {
    const queryParams = new URLSearchParams({
      ...(id ? { id } : {}),
      day,
      semester,
      year,
      mode: "edit",
    });
    router.push(`/workload/entry?${queryParams.toString()}`);
  };

  const hasWeekData = lectureWeeks.length > 0 || labWeeks.length > 0;

  return (
    <div
      className={`rounded-xl border border-l-4 p-3 sm:p-4 shadow-sm transition-shadow hover:shadow-md ${statusInfo.cardBgColor} ${statusInfo.cardBorderColor} ${statusInfo.cardBorderLeftColor} dark:shadow-[0_10px_30px_rgba(0,0,0,0.1)]`}
    >
      {/* ── Header: Course Code ── */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex-1">
          <p className={`text-sm sm:text-base font-extrabold line-clamp-1 ${statusInfo.codeTxtColor}`}>
            {courseCode}
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <hr className={`my-2 ${statusInfo.dividerColor}`} />

      {/* ── Course Name ── */}
      <p className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-orange-50 leading-snug mb-2 sm:mb-3">
        {courseName}
      </p>

      {/* ── Course Details ── */}
      <div className="space-y-1 sm:space-y-1.5 text-gray-500 dark:text-orange-100/75 mb-3">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/65" />
          <span className="line-clamp-1">{time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/65" />
          <span className="line-clamp-1">{room}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Users className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/65" />
          <span className="line-clamp-1">Students : {studentCount}</span>
        </div>
      </div>

      {/* ── Week Grid Section ── */}
      <div className={`pt-2 mt-2 border-t space-y-2.5 mb-3 ${statusInfo.dividerColor}`}>
        {hasWeekData ? (
          <>
            {/* Lecture weeks */}
            <WeekMiniGrid
              label="ทฤษฎี"
              selectedWeeks={lectureWeeks}
              activeBg={statusInfo.weekActiveBg}
              activeText={statusInfo.weekActiveText}
              inactiveBg={statusInfo.weekInactiveBg}
            />

            {/* Lab weeks */}
            <WeekMiniGrid
              label="ปฏิบัติ"
              selectedWeeks={labWeeks}
              activeBg={statusInfo.weekActiveBg}
              activeText={statusInfo.weekActiveText}
              inactiveBg={statusInfo.weekInactiveBg}
            />
          </>
        ) : (
          /* No weeks selected yet — show empty placeholder rows */
          <div className="space-y-2.5">
            {['ทฤษฎี', 'ปฏิบัติ'].map((label) => (
              <div key={label} className="space-y-1">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {label}
                </span>
                <div className="flex gap-0.75">
                  {Array.from({ length: TOTAL_WEEKS }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-3.5 rounded-[3px] ${statusInfo.weekInactiveBg}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between px-px">
                  <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">1</span>
                  <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">8</span>
                  <span className="text-[8px] text-gray-300 dark:text-gray-600 font-medium">15</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Action Buttons & Status Badge ── */}
      <div className={`flex flex-col gap-2 pt-2 sm:pt-3 border-t z-10 ${statusInfo.dividerColor}`}>
        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className={`flex items-center justify-center py-2 px-2 rounded-full border ${statusInfo.buttonBorderColor} ${statusInfo.buttonBgColor} ${statusInfo.buttonTextColor} transition-colors duration-200 group touch-manipulation`}
          title="Edit"
        >
          <Pen className="h-4 w-4 group-hover:scale-110 group-active:scale-95 transition-transform" />
        </button>

        {/* Status Badge */}
        <div className={`flex items-center justify-start gap-2 py-2 px-3 rounded-full border ${statusInfo.cardBorderColor} ${statusInfo.bgColor}`}>
          <div className={statusInfo.textColor}>
            {statusInfo.icon}
          </div>
          <span className={`text-xs sm:text-sm font-semibold ${statusInfo.textColor}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
}
