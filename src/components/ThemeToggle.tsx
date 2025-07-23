import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme-hook';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 sm:p-3 transition-colors duration-200 rounded-full cursor-pointer bg-stone-100 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-600"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );
}

export default ThemeToggle;
