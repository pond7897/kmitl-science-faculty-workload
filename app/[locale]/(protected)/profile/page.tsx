import { getAuthSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session) {
    redirect('/');
  }

  const { profile, userinfo } = session;

  const fields = [
    { label: 'ชื่อ (ภาษาไทย)', value: profile?.data.firstname_th },
    { label: 'นามสกุล (ภาษาไทย)', value: profile?.data.lastname_th },
    { label: 'ชื่อ (English)', value: profile?.data.firstname_en },
    { label: 'นามสกุล (English)', value: profile?.data.lastname_en },
    { label: 'ตำแหน่ง', value: profile?.data.position_en },
    { label: 'อีเมล', value: userinfo?.data.email },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ข้อมูลส่วนตัว
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          ยินดีต้อนรับ {profile?.data.firstname_th || 'User'}{' '}
          {profile?.data.lastname_th || ''}
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
          รายละเอียดผู้ใช้
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                {label}
              </dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                {value || '—'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Raw JSON (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <summary className="text-sm font-medium text-gray-500 cursor-pointer select-none">
            Raw session data (dev only)
          </summary>
          <pre className="mt-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-auto text-xs text-gray-700 dark:text-gray-300">
            {JSON.stringify({ profile, userinfo }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
