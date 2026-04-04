"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WorkloadSummaryCards } from "./WorkloadSummaryCards";
import { WorkloadHistoryFilter } from "./WorkloadHistoryFilter";
import { WorkloadHistoryTable } from "./WorkloadHistoryTable";
import type { WorkloadHistoryServiceItem } from "@/lib/services/workload/history.service";

export type { WorkloadStatus } from "@/lib/services/workload/history.service";
export type WorkloadRecord = WorkloadHistoryServiceItem;

interface WorkloadHistoryContentProps {
  histories: WorkloadHistoryServiceItem[];
}

const ITEMS_PER_PAGE = 5;

export function WorkloadHistoryContent({
  histories,
}: WorkloadHistoryContentProps) {
  const { t } = useTranslation();

  const [yearQuery, setYearQuery] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const toEditCount = histories.filter(
    (r) => r.status === "needsRevision",
  ).length;
  const approvedCount = histories.filter((r) => r.status === "approved").length;
  const rejectedCount = histories.filter((r) => r.status === "rejected").length;

  const uniqueSemesters = [...new Set(histories.map((r) => r.semester))].sort(
    (a, b) => Number(a) - Number(b),
  );

  const filtered = histories.filter((r) => {
    const matchYear = !yearQuery || r.year.includes(yearQuery);
    const matchSemester = !filterSemester || r.semester === filterSemester;
    return matchYear && matchSemester;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [yearQuery, filterSemester]);

  // WorkloadHistoryContent.tsx

  return (
    <div className="flex w-full flex-col items-center gap-3 pt-4 md:gap-3.75 md:pt-5">
      {/* ── Wrapper ── */}
      <div className="w-full space-y-3 md:space-y-3.75">
        {/* Title */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-semibold leading-tight text-foreground md:text-[24px] md:leading-7.5">
            {t("WorkloadHistory.title")}
          </h1>
          <p className="text-sm font-medium text-muted-foreground md:text-[18px] md:leading-7">
            {t("WorkloadHistory.subtitle")}
          </p>
        </div>

        {/* Summary cards */}
        <WorkloadSummaryCards
          toEditCount={toEditCount}
          approvedCount={approvedCount}
          rejectedCount={rejectedCount}
        />

        {/* Filter + Table */}
        <WorkloadHistoryFilter
          yearQuery={yearQuery}
          setYearQuery={setYearQuery}
          filterSemester={filterSemester}
          setFilterSemester={setFilterSemester}
          uniqueSemesters={uniqueSemesters}
        />
        <WorkloadHistoryTable
          records={paginated}
          totalFiltered={filtered.length}
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
