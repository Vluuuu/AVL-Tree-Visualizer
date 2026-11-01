import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { BookOpen, GitFork, Languages, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenTheory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTheory }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-teal-700 dark:bg-teal-600 flex items-center justify-center text-white shadow-2xs">
              <GitFork className="h-5 w-5 transform rotate-180" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
                  {t.appTitle}
                </h1>
                <span className="text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300">
                  Algorithm Lab
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? t.themeToggleLight : t.themeToggleDark}
            aria-label={isDark ? t.themeToggleLight : t.themeToggleDark}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.themeLight}</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-slate-600" />
                <span className="hidden sm:inline">{t.themeDark}</span>
              </>
            )}
          </button>

          {/* Theory Guide Modal Trigger */}
          <button
            type="button"
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
            <span>{t.theoryGuideBtn}</span>
          </button>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
            <span className="tracking-wide">
              {language === 'id' ? (
                <>
                  <span className="text-teal-700 dark:text-teal-400">ID</span> / EN
                </>
              ) : (
                <>
                  ID / <span className="text-teal-700 dark:text-teal-400">EN</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
