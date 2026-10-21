'use client';

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Ambil tema aktif yang sudah diset oleh script inline di head
    const currentTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 w-auto truncate py-1.5 rounded-full lg:rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-accent-foreground"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}