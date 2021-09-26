import { useState, createContext, useContext } from "react";

const WindowsContext = createContext({});
export const useWindows = () => useContext(WindowsContext);

export function WindowsProvider({ children }) {
  const windowConfig = {
    1: {
      title: "Stats",
      component: () => null,
      open: false,
    },
  };

  const [windows, setWindows] = useState(windowConfig);

  const updateWindow = (id, config) => {
    const wind = windowConfig[id];
    if (!wind) return;

    const windowsCopy = { ...windows, [id]: { ...wind, ...config } };
    setWindows(windowsCopy);
  };

  const closeWindow = (id) => {
    updateWindow(id, { open: false });
  };

  const openWindow = (id) => {
    updateWindow(id, { open: true });
  };

  const get = (id) => {
    return windows[id] || {};
  };

  const ctx = {
    get,
    windows,
    closeWindow,
    openWindow,
  };

  return (
    <WindowsContext.Provider value={ctx}>{children}</WindowsContext.Provider>
  );
}
