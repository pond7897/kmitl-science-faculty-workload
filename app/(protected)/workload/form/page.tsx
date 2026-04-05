'use client';

import { WorkloadForm } from '@/components/workload';

export default function WorkloadFormPage() {
  return (
    <WorkloadForm
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
