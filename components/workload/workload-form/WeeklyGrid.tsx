'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { WorkloadCard } from './WorkloadCard';
import { EmptyState } from './EmptyState';
import { Plus, Table, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

interface WeeklyGridProps {
  columns: DayColumn[];
  semesterBadge: string;
  onAddClick: (dayCode: string) => void;
}

// ────────────────────────────────────────────────────────────
// Badge แสดงจำนวนวิชา — เปลี่ยนสีตามความหนาแน่น
// ────────────────────────────────────────────────────────────
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
      className={`inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[10px] font-semibold leading-none ${color}`}
    >
      {count}
    </span>
  );
}



// ────────────────────────────────────────────────────────────
// Desktop Column — แสดง 2 card แรก + ปุ่ม "X วิชาเพิ่มเติม"
// ────────────────────────────────────────────────────────────
const PREVIEW_COUNT = 2;

function DesktopColumn({
  courses,
  onAddClick,
  isTh,
}: {
  courses: DayColumn['courses'];
  onAddClick: () => void;
  isTh: boolean;
}) {
  // const [expanded, setExpanded] = useState(false);
  //
  // const hasMore = courses.length > PREVIEW_COUNT;
  // const hiddenCount = courses.length - PREVIEW_COUNT;
  // const visibleCourses = expanded ? courses : courses.slice(0, PREVIEW_COUNT);

  return (
    <div className="flex flex-col gap-1.5 p-1.5 pb-4">
      {courses.length > 0 ? (
        <>
          {/* Card list */}
          <div className="flex flex-col gap-1.5">
            {courses.map((course) => (
              <WorkloadCard
                key={course.id}
                courseCode={course.courseCode}
                courseName={course.courseName}
                time={course.time}
                room={course.room}
                studentCount={course.studentCount}
              />
            ))}
          </div>

          {/* ปุ่ม "X วิชาเพิ่มเติม" / "ย่อ" - Commented out temporarily to show all courses */}
          {/* 
          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-semibold transition-all hover:bg-orange-100 dark:bg-[#C96442]/20 dark:text-[#C96442] dark:hover:bg-[#C96442]/30 border border-orange-200 dark:border-[#C96442]/40 cursor-pointer"
            >
              {expanded ? (
                <>
                  <ChevronDown className="h-3 w-3 rotate-180" />
                  <span>{isTh ? 'ย่อ' : 'Show less'}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  <span>
                    {isTh
                      ? `+${hiddenCount} วิชาเพิ่มเติม`
                      : `+${hiddenCount} more`}
                  </span>
                </>
              )}
            </button>
          )}
          */}

          {/* ปุ่ม + เพิ่มวิชา */}
          <button
            onClick={onAddClick}
            className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-full border-2 border-orange-400 bg-white text-orange-500 transition-all hover:bg-orange-50 hover:border-orange-500 dark:bg-[#302826] dark:border-[#C96442] dark:text-[#C96442] dark:hover:bg-[#3d3533] flex-shrink-0 cursor-pointer text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isTh ? 'เพิ่มวิชา' : 'Add Course'}</span>
          </button>
        </>
      ) : (
        <EmptyState onAddClick={onAddClick} />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// WeeklyGrid — Main Export
// ────────────────────────────────────────────────────────────
export function WeeklyGrid({
  columns,
  semesterBadge,
  onAddClick,
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
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-[#f0ebe5]">
            {isTh ? 'ตารางสรุปภาระงาน' : 'Workload Schedule Summary'}
          </span>
        </div>
        <span className="inline-flex items-center rounded-sm bg-[#F27F0D] px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white dark:bg-[#C96442] w-fit">
          {semesterBadge}
        </span>
      </div>

      {/* ════════════════════════════════════════
          MOBILE VIEW — shadcn/ui Accordion (< sm)
          ════════════════════════════════════════ */}
      <div className="sm:hidden pb-2">
        <Accordion
          type="multiple"
          // วันที่มีวิชาจะ expand อัตโนมัติ
          defaultValue={[]}
          className="space-y-2"
        >
          {days.map((day) => {
            const column = columns.find((c) => c.dayCode === day.code);
            const courses = column?.courses ?? [];
            const hasCourses = courses.length > 0;

            return (
              <AccordionItem
                key={day.code}
                value={day.code}
                className="border border-gray-200 dark:border-[#4a4441] rounded-xl"
              >
                <AccordionTrigger className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#302826] hover:bg-gray-100 dark:hover:bg-[#3d3533] hover:no-underline [&[data-state=open]]:rounded-b-none [&[data-state=open]]:bg-gray-100 dark:[&[data-state=open]]:bg-[#3d3533]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-[#f0ebe5]">
                      {day.name}
                    </span>
                    <CourseBadge count={courses.length} />
                    {!hasCourses && (
                      <span className="text-xs text-gray-400 dark:text-[#8b7f77]">
                        {isTh ? 'ว่าง' : 'Free'}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-3 rounded-b-xl bg-white dark:bg-[#292524]">
                  <div className="space-y-2">
                    {hasCourses ? (
                      <>
                        {courses.map((course) => (
                          <WorkloadCard
                            key={course.id}
                            courseCode={course.courseCode}
                            courseName={course.courseName}
                            time={course.time}
                            room={course.room}
                            studentCount={course.studentCount}
                          />
                        ))}
                        <button
                          onClick={() => onAddClick(day.code)}
                          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 border-orange-400 bg-white text-orange-500 text-sm font-medium transition-all hover:bg-orange-50 hover:border-orange-500 dark:bg-[#302826] dark:border-[#C96442] dark:text-[#C96442] dark:hover:bg-[#3d3533]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>{isTh ? 'เพิ่มวิชา' : 'Add course'}</span>
                        </button>
                      </>
                    ) : (
                      <EmptyState onAddClick={() => onAddClick(day.code)} />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* ════════════════════════════════════════
          DESKTOP VIEW — 7-column grid (≥ sm)
          ════════════════════════════════════════ */}
      <div className="hidden sm:block -mx-4 sm:-mx-5">
        {/* Header row — มี badge จำนวนวิชา */}
        <div className="grid grid-cols-7 bg-gray-100 dark:bg-[#3d3533] border-y border-gray-200 dark:border-[#4a4441]">
          {days.map((day) => {
            const column = columns.find((c) => c.dayCode === day.code);
            const count = column?.courses.length ?? 0;

            return (
              <div key={day.code} className="py-2 sm:py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-[#e8e0d8] line-clamp-1">
                    {day.name}
                  </p>
                  <CourseBadge count={count} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Content row */}
        <div className="relative grid grid-cols-7 bg-white dark:bg-[#292524] -mb-4 sm:-mb-5">
          {/* Vertical dividers */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-[#4a4441] pointer-events-none"
              style={{ left: `${(i / 7) * 100}%` }}
            />
          ))}

          {days.map((day) => {
            const column = columns.find((c) => c.dayCode === day.code);
            const courses = column?.courses ?? [];

            return (
              <DesktopColumn
                key={day.code}
                courses={courses}
                onAddClick={() => onAddClick(day.code)}
                isTh={isTh}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}