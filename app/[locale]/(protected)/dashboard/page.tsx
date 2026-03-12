export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          แดชบอร์ด
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          ภาพรวมภาระงานของคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder cards */}
        {['ภาระงานทั้งหมด', 'ภาระงานรอการอนุมัติ', 'ภาระงานที่อนุมัติแล้ว'].map(
          (label) => (
            <div
              key={label}
              className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-3xl font-bold text-[#F27F0D] mt-1">—</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
