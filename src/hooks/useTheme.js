import { useState, useEffect } from 'react';
import { getStoredSettings, saveStoredSettings } from '../lib/db/storage';

export function useTheme() {
  const [settings, setSettings] = useState(() => {
    const s = getStoredSettings();
    return { ...s, theme: 'dark' };
  });

  useEffect(() => {
    // Lock theme permanently to dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    
    // Apply density class
    if (settings.density === 'compact') {
      document.body.classList.add('density-compact');
    } else {
      document.body.classList.remove('density-compact');
    }

    saveStoredSettings({ ...settings, theme: 'dark' });
  }, [settings]);

  const updateSettings = (newPartial) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial, theme: 'dark' };
      saveStoredSettings(updated);
      return updated;
    });
  };

  return {
    settings,
    updateSettings,
  };
}
