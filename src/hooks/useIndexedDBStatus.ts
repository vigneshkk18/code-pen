import { getPenDB } from "@/db";
import { useEffect, useState } from "react";

const penDB = getPenDB();

export default function useIndexedDBStatus() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (penDB.db) setIsReady(true);
    penDB.onDBRegistered = () => {
      setIsReady(true);
    };
  }, []);

  return isReady;
}
