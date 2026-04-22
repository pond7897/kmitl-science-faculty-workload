'use client';

import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { LibraryBig } from 'lucide-react';
import { TimePicker } from './TimePicker';

interface TimeRange {
  start: string;
  end: string;
}

interface TeachingInfoSectionProps {
  degreeLevel: string;
  onDegreeLevelChange: (value: string) => void;
  lectureTime: TimeRange;
  onLectureTimeChange: (time: TimeRange) => void;
  labTime: TimeRange;
  onLabTimeChange: (time: TimeRange) => void;
  errors?: Record<string, string>;
}

function calculateHours(start: string, end: string): string | null {
  if (!start || !end) return null;
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  if (endMinutes <= startMinutes) return null;
  const diff = endMinutes - startMinutes;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (m === 0) return `${h}`;
  return `${h}.${Math.round((m / 60) * 10)}`;
}

function TimePanel({
  title,
  time,
  onTimeChange,
  errors = {},
  startKey,
  endKey,
}: {
  title: string;
  time: TimeRange;
  onTimeChange: (t: TimeRange) => void;
  errors?: Record<string, string>;
  startKey: string;
  endKey: string;
}) {
  const hours = calculateHours(time.start, time.end);
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#3d3533]">
      <div className="mb-4 pb-3 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-[#f0ebe5]">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-600 dark:text-[#c8bfb8]">
            {t("WorkloadEntry.startTime")}
          </Label>
          <TimePicker
            value={time.start}
            onChange={(v) => onTimeChange({ ...time, start: v })}
            hasError={!!errors[startKey]}
          />
          {errors[startKey] && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors[startKey]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-600 dark:text-[#c8bfb8]">
            {t("WorkloadEntry.endTime")}
          </Label>
          <TimePicker
            value={time.end}
            onChange={(v) => onTimeChange({ ...time, end: v })}
            hasError={!!errors[endKey]}
          />
          {errors[endKey] && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors[endKey]}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-[#8b7f77]">
        <span>{t("WorkloadEntry.hours")} :</span>
        {hours !== null ? (
          <span className="font-black text-sm sm:text-base text-gray-900 dark:text-[#f0ebe5]">
            {hours}
          </span>
        ) : (
          <span className="text-gray-300 dark:text-[#4a4441] font-semibold">—</span>
        )}
      </div>
    </div>
  );
}

export function TeachingInfoSection({
  degreeLevel,
  onDegreeLevelChange,
  lectureTime,
  onLectureTimeChange,
  labTime,
  onLabTimeChange,
  errors = {},
}: TeachingInfoSectionProps) {
  const { t } = useTranslation();

  const degreeLevels = [
    { value: 'bachelor_regular', label: t("WorkloadEntry.degreeLevelBachelor") },
    { value: 'bachelor_international', label: t("WorkloadEntry.degreeLevelInternational") },
    { value: 'master', label: t("WorkloadEntry.degreeLevelMaster") },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <LibraryBig className="h-4 w-4" />
          </span>
          {t("WorkloadEntry.teachingInfo")}
        </h2>
      </div>

      {/* Degree Level */}
      <div className="mb-5 sm:mb-6">
        <Label className="mb-3 block text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
          {t("WorkloadEntry.degreeLevel")}
        </Label>
        <div
          className={[
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 rounded-xl p-1 transition-colors",
            errors.degreeLevel
              ? "ring-2 ring-red-400 dark:ring-red-500 bg-red-50/50 dark:bg-red-900/10"
              : "",
          ].join(" ")}
        >
          {degreeLevels.map((level) => {
            const isSelected = degreeLevel === level.value;
            return (
              <label
                key={level.value}
                className={[
                  'flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all',
                  isSelected
                    ? 'border-[#F27F0D] bg-orange-50 dark:border-[#C96442] dark:bg-[#C96442]/10'
                    : errors.degreeLevel
                      ? 'border-red-200 hover:border-red-300 dark:border-red-500/40 dark:hover:border-red-500/60'
                      : 'border-gray-200 hover:border-orange-300 dark:border-[#4a4441] dark:hover:border-[#C96442]/50',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="degreeLevel"
                  value={level.value}
                  checked={isSelected}
                  onChange={(e) => onDegreeLevelChange(e.target.value)}
                  className="h-4 w-4 sm:h-5 sm:w-5 accent-orange-500 cursor-pointer shrink-0"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-[#f0ebe5]">
                  {level.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.degreeLevel && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">
            {errors.degreeLevel}
          </p>
        )}
      </div>

      {/* Time Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TimePanel
          title={t("WorkloadEntry.lectureTime")}
          time={lectureTime}
          onTimeChange={onLectureTimeChange}
          errors={errors}
          startKey="lectureTimeStart"
          endKey="lectureTimeEnd"
        />
        <TimePanel
          title={t("WorkloadEntry.labTime")}
          time={labTime}
          onTimeChange={onLabTimeChange}
          errors={errors}
          startKey="labTimeStart"
          endKey="labTimeEnd"
        />
      </div>
    </div>
  );
}