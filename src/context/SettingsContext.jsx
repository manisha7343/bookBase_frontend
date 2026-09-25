import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

// Public library info (name, loan rules, contact) shared by many pages
const defaults = { libraryName: "BookBase", maxBooks: 5, borrowDuration: 14 };
const SettingsContext = createContext({ settings: defaults, refresh: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  const refresh = useCallback(() => {
    api("/admin/settings")
      .then((data) => setSettings(data.settings))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>{children}</SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
