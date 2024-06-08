import { useEffect, useSyncExternalStore } from "react";

let fullscreenenabled = false;

let listeners: any[] = [];

const fn = () => {
  fullscreenenabled = !!(
    document.fullscreenEnabled && document.fullscreenEnabled
  );
  emitChange();
};

const fullScreenObserver = {
  observe() {
    fullscreenenabled = !!(
      document.fullscreenElement && document.fullscreenEnabled
    );

    document.addEventListener("fullscreenchange", fn);
  },
  subscribe(listener: any) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((currListener) => currListener !== listener);
    };
  },
  getSnapshot() {
    return fullscreenenabled;
  },
  getServerSnapshot() {
    return fullscreenenabled;
  },
};

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export default function useFullScreenObserver() {
  const enabled = useSyncExternalStore(
    fullScreenObserver.subscribe,
    fullScreenObserver.getSnapshot,
    fullScreenObserver.getServerSnapshot
  );

  useEffect(() => {
    fullScreenObserver.observe();
  }, []);

  return enabled;
}
