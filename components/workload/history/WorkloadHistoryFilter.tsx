'use client';

import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkloadHistoryFilterProps {
  yearQuery: string;
  setYearQuery: (v: string) => void;
  filterSemester: string;
  setFilterSemester: (v: string) => void;
  uniqueSemesters: string[];
}

export function WorkloadHistoryFilter({
  yearQuery,
  setYearQuery,
  filterSemester,
  setFilterSemester,
  uniqueSemesters,
}: WorkloadHistoryFilterProps) {
  const { t } = useTranslation();

  return (
    /* Frame 24: padding 20px, gap 15px, border #E2E8F0, radius 10px */
    <div className="w-full rounded-[10px] border border-[#E2E8F0] bg-white p-5 dark:border-[#3A312E] dark:bg-[#211B19]">
      <div className="flex w-full flex-col items-stretch gap-[15px] sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-[15px] sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-[5px]">
            <label
              htmlFor="workload-year-query"
              className="text-[14px] font-medium leading-5 text-[#160906] dark:text-[#F5EEE8]"
            >
              {t('WorkloadHistory.yearLabel')}
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#ACACAC] dark:text-[#7F736C]" />
              <Input
                id="workload-year-query"
                type="text"
                value={yearQuery}
                onChange={(e) => setYearQuery(e.target.value)}
                placeholder={t('WorkloadHistory.searchPlaceholder')}
                className="h-12 w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-[46px] pr-5 text-[14px] leading-none font-light text-[#160906] shadow-none placeholder:text-[14px] placeholder:leading-none placeholder:font-light placeholder:text-[#ACACAC] focus-visible:border-[#F27F0D] focus-visible:ring-2 focus-visible:ring-[#F27F0D]/15 dark:border-[#4A3D38] dark:bg-[#2B2421] dark:text-[#F5EEE8] dark:placeholder:text-[#7F736C]"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-[5px]">
            <label
              htmlFor="workload-semester"
              className="text-[14px] font-medium leading-5 text-[#160906] dark:text-[#F5EEE8]"
            >
              {t('WorkloadHistory.semesterLabel')}
            </label>

            <Select
              value={filterSemester || '__all__'}
              onValueChange={(value) => setFilterSemester(value === '__all__' ? '' : value)}
            >
              <SelectTrigger id="workload-semester">
                <SelectValue placeholder={t('WorkloadHistory.allSemesters')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t('WorkloadHistory.allSemesters')}</SelectItem>
                {uniqueSemesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
