
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update the HTML data-theme attribute
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    // Store the preference in local storage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-full hover:bg-zinc-800 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun size={20} className="text-zinc-400 hover:text-white transition-colors" />
      ) : (
        <Moon size={20} className="text-zinc-400 hover:text-white transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
