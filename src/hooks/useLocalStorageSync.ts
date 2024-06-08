import { useRef, useState, useEffect } from "react";

export default function useLocalStorageSync(
  data: any,
  key: string,
  delay = 1000
) {
  const syncTimer = useRef<NodeJS.Timeout>();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsSyncing(true);
    const fn = () => {
      localStorage.setItem(key, JSON.stringify(data));
      setIsSyncing(false);
    };
    syncTimer.current = setTimeout(fn, delay);

    return () => {
      clearTimeout(syncTimer.current);
      syncTimer.current = undefined;
    };
  }, [data]);

  return isSyncing;
}
