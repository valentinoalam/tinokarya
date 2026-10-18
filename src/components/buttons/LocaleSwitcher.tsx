'use client';

import { usePathname, useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Dapatkan locale aktif saat ini dari segmen URL pertama (misal: /id/price -> "id")
  const currentLocale = pathname.split('/')[1] || routing.defaultLocale;

  const handleLocaleChange = (newLocale: string) => {
    if (currentLocale === newLocale) return;

    // Ganti segmen bahasa pertama dengan bahasa yang baru
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 rounded-lg p-1 text-sm">
      {routing.locales.map((loc) => {
        const isActive = currentLocale === loc;
        return (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                + 'text-xs' // penyesuaian gaya
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}