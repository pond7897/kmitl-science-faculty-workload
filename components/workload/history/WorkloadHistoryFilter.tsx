'use client';

import { useTranslation } from 'react-i18next';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WorkloadHistoryFilterProps {
  yearQuery: string;
  setYearQuery: (v: string) => void;
  filterSemester: string;
  setFilterSemester: (v: string) => void;
  uniqueSemesters: string[];
  onFilter: () => void;
}

export function WorkloadHistoryFilter({
  yearQuery,
  setYearQuery,
  filterSemester,
  setFilterSemester,
  uniqueSemesters,
  onFilter,
}: WorkloadHistoryFilterProps) {
  const { t } = useTranslation();

  return (
    /* Frame 24: padding 20px, gap 15px, border #E2E8F0, radius 10px */
    <div className="w-full rounded-[10px] border border-[#E2E8F0] bg-white p-5">
      {/* Frame 1000004419: flex-row, items-end, gap 15px */}
      <div className="flex w-full flex-col items-stretch gap-[15px] sm:flex-row sm:items-end">

        {/* Frame 1000004458: flex-row, gap 15px — wraps both inputs */}
        <div className="flex flex-1 flex-col gap-[15px] sm:flex-row sm:items-end">

          {/* input block — ปีการศึกษา: flex-col, gap 5px, height 77px */}
          <div className="flex flex-1 flex-col gap-[5px]">
            {/* Title: font-weight 500, font-size 18px, color #160906 */}
            <label
              htmlFor="workload-year-query"
              className="text-[18px] font-medium leading-6 text-[#160906]"
            >
              {t('WorkloadHistory.yearLabel')}
            </label>

            {/* Frame 174: height 48px, padding 16px 20px, border #E2E8F0, radius 10px */}
            <div className="relative">
              {/* Search icon: 18x18, color #ACACAC, gap 18px จาก icon ถึง text */}
              <Search className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#ACACAC]" />
              <Input
                id="workload-year-query"
                type="text"
                value={yearQuery}
                onChange={(e) => setYearQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onFilter()}
                placeholder={t('WorkloadHistory.searchPlaceholder')}
                className="h-12 w-full rounded-[10px] border border-[#E2E8F0] bg-white py-4 pl-[46px] pr-5 text-base font-light text-[#160906] shadow-none placeholder:font-light placeholder:text-[#ACACAC] focus-visible:border-[#F27F0D] focus-visible:ring-2 focus-visible:ring-[#F27F0D]/15"
              />
            </div>
          </div>

          {/* input block — ภาคเรียน: flex-col, gap 5px, height 77px */}
          <div className="flex flex-1 flex-col gap-[5px]">
            {/* Title: font-weight 500, font-size 18px, color #160906 */}
            <label
              htmlFor="workload-semester"
              className="text-[18px] font-medium leading-6 text-[#160906]"
            >
              {t('WorkloadHistory.semesterLabel')}
            </label>

            {/* Frame 174: height 48px, padding 16px 20px, border #E2E8F0, radius 10px */}
            <div className="relative">
              <select
                id="workload-semester"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="h-12 w-full appearance-none rounded-[10px] border border-[#E2E8F0] bg-white px-5 py-4 pr-12 text-base font-light text-[#160906] outline-none focus:border-[#F27F0D] focus:ring-2 focus:ring-[#F27F0D]/15"
              >
                <option value="">{t('WorkloadHistory.allSemesters')}</option>
                {uniqueSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
              {/* ChevronDown: 18x18, color #000000 */}
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#160906]" />
            </div>
          </div>
        </div>

        {/* Frame 1000004416: 135x48px, padding 10px 20px, bg #F27F0D, shadow, radius 10px */}
        <button
          id="workload-filter-btn"
          type="button"
          onClick={onFilter}
          className="flex h-12 w-full items-center justify-center gap-[10px] rounded-[10px] bg-[#F27F0D] px-5 py-[10px] text-base font-light text-white shadow-[0px_4px_4px_rgba(255,113,0,0.25)] transition-colors hover:bg-[#E97500] active:bg-[#D76800] sm:w-[135px] sm:flex-shrink-0"
        >
          {/* กรองข้อมูล: font-weight 300, font-size 16px, color #FFFFFF */}
          <span className="text-[16px] font-light">{t('WorkloadHistory.filterBtn')}</span>
          {/* Search icon: 20x20, color #FFFFFF */}
          <Search className="h-5 w-5" />
        </button>

      </div>
    </div>
  );
}