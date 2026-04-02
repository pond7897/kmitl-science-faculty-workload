'use client';

import { WorkloadForm } from '@/components/workload';

export default function WorkloadFormPage() {
  return (
    <WorkloadForm
      title="ข้อมูลภาระงาน"
      subtitle="รายละเอียดข้อมูลภาระงานปัจจุบัน"
      onDownloadExcel={() => {
        console.log('Downloading Excel...');
        // TODO: Implement Excel download logic
      }}
      onConfirm={() => {
        console.log('Confirming data...');
        // TODO: Implement confirm logic
      }}
    />
  );
}
