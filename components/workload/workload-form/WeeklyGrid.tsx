'use client';

import { useLanguage } from '@/hooks/use-language';
import { WorkloadCard } from './WorkloadCard';
import { Table } from 'lucide-react';

interface DayColumn {
  dayCode: string;
  dayName: string;
  courses: Array<{
    id: string;
    courseCode: string;
    courseName: string;
    time: string;
    room: string;
    studentCount: number;
  }>;
}

export type WeeklyGridColumn = DayColumn;

interface WeeklyGridProps {
  columns: DayColumn[];
  semesterBadge: string;
}

function CourseBadge({ count }: { count: number }) {
  if (count === 0) return null;

  const color =
    count >= 6
      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
      : count >= 3
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

  return (
    <span
      className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] leading-none font-semibold ${color}`}
    >
      {count}
    </span>
  );
}

function EmptyDayState({ isTh }: { isTh: boolean }) {
  return (
    <div className="flex min-h-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 text-center dark:border-[#4a4441] dark:bg-[#302826] sm:min-h-32 sm:p-4">
      <p className="text-xs text-gray-500 dark:text-[#8b7f77] sm:text-sm">
        {isTh ? 'ไม่มีข้อมูลภาระงาน' : 'No workload data'}
      </p>
    </div>
  );
}

function DesktopColumn({
  courses,
  isTh,
}: {
  courses: DayColumn['courses'];
  isTh: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-1.5 pb-4">
      {courses.length > 0 ? (
        courses.map((course) => (
          <WorkloadCard
            key={course.id}
            courseCode={course.courseCode}
            courseName={course.courseName}
            time={course.time}
            room={course.room}
            studentCount={course.studentCount}
          />
        ))
      ) : (
        <EmptyDayState isTh={isTh} />
      )}
    </div>
  );
}

export function WeeklyGrid({
  columns,
  semesterBadge,
}: WeeklyGridProps) {
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === 'th';

  const days = [
    { code: 'sunday', name: isTh ? 'อาทิตย์' : 'Sunday' },
    { code: 'monday', name: isTh ? 'จันทร์' : 'Monday' },
    { code: 'tuesday', name: isTh ? 'อังคาร' : 'Tuesday' },
    { code: 'wednesday', name: isTh ? 'พุธ' : 'Wednesday' },
    { code: 'thursday', name: isTh ? 'พฤหัสบดี' : 'Thursday' },
    { code: 'friday', name: isTh ? 'ศุกร์' : 'Friday' },
    { code: 'saturday', name: isTh ? 'เสาร์' : 'Saturday' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
          <span className="text-sm font-semibold text-gray-800 dark:text-[#f0ebe5] sm:text-base">
            {isTh ? 'ตารางสรุปภาระงาน' : 'Workload Schedule Summary'}
          </span>
        </div>
        <span className="inline-flex w-fit items-center rounded-sm bg-[#F27F0D] px-3 py-2 text-xs font-semibold text-white dark:bg-[#C96442] sm:px-5 sm:text-sm">
          {semesterBadge}
        </span>
      </div>

      <div className="space-y-2 sm:hidden">
        {days.map((day) => {
          const column = columns.find((item) => item.dayCode === day.code);
          const courses = column?.courses ?? [];

          return (
            <div
              key={day.code}
              className="overflow-hidden rounded-xl border border-gray-200 dark:border-[#4a4441]"
            >
              <div className="flex items-center gap-2.5 bg-gray-50 px-4 py-3 dark:bg-[#302826]">
                <span className="text-sm font-semibold text-gray-800 dark:text-[#f0ebe5]">
                  {day.name}
                </span>
                <CourseBadge count={courses.length} />
                {courses.length === 0 && (
                  <span className="text-xs text-gray-400 dark:text-[#8b7f77]">
                    {isTh ? 'ว่าง' : 'Free'}
                  </span>
                )}
              </div>

              <div className="space-y-2 bg-white p-3 dark:bg-[#292524]">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <WorkloadCard
                      key={course.id}
                      courseCode={course.courseCode}
                      courseName={course.courseName}
                      time={course.time}
                      room={course.room}
                      studentCount={course.studentCount}
                    />
                  ))
                ) : (
                  <EmptyDayState isTh={isTh} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:block">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#4a4441] dark:bg-[#292524]">
          <div className="grid grid-cols-7 bg-white dark:bg-[#292524]">
            {days.map((day, index) => {
              const column = columns.find((item) => item.dayCode === day.code);
              const count = column?.courses.length ?? 0;

              return (
                <div
                  key={day.code}
                  className={`border-b border-gray-200 py-2 text-center dark:border-[#4a4441] sm:py-3 ${
                    index !== days.length - 1 ? 'border-r' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 px-2">
                    <p className="line-clamp-1 text-xs font-semibold text-gray-600 dark:text-[#e8e0d8] sm:text-sm">
                      {day.name}
                    </p>
                    <CourseBadge count={count} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 bg-white dark:bg-[#292524]">
            {days.map((day, index) => {
              const column = columns.find((item) => item.dayCode === day.code);
              const courses = column?.courses ?? [];

              return (
                <div
                  key={day.code}
                  className={index !== days.length - 1 ? 'border-r border-gray-200 dark:border-[#4a4441]' : ''}
                >
                  <DesktopColumn
                    courses={courses}
                    isTh={isTh}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
