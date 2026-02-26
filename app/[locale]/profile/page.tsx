import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('user_info');
  
  if (!userInfoCookie) {
    redirect('/');
  }
  
  const { profile, userinfo } = JSON.parse(userInfoCookie.value);

  return (
    <main className="min-h-screen bg-[#F9F4EE] dark:bg-[#1a1a1a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              ยินดีต้อนรับ {profile?.data.firstname_th || profile?.full_name_en || 'User'} {profile?.data.lastname_th || ''}
            </p>
          </div>
          <a
            href="/api/auth/logout"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            ออกจากระบบ
          </a>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ข้อมูลผู้ใช้
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ชื่อ (ภาษาไทย)</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {profile?.data.firstname_th || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ชื่อ (ภาษาอังกฤษ)</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {profile?.data.firstname_en || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">อีเมล</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {userinfo?.data.email || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            รายละเอียดเพิ่มเติม
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify({ profile, userinfo }, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
