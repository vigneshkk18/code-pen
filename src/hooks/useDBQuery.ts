import { useEffect, useRef, useState } from "react";

import { DB } from "@/db";
import { DataStoreMessage } from "./useDBMutation";
import useIndexedDBStatus from "./useIndexedDBStatus";

interface DBState<T> {
  data: T[];
  error: boolean;
  message: string;
  isPending: boolean;
}

function arrayEqual(a1: any[], a2: any[]) {
  if (a1.length !== a2.length) return false;
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}

export default function useDBQuery<T>(
  db: DB<T>,
  DB_STORE_KEY?: string,
  filterFn?: (data: T) => boolean,
  deps: any[] = [],
  limit?: number,
  offset?: number
) {
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const [dbState, setDBState] = useState<DBState<T>>({
    data: [],
    error: false,
    message: "",
    isPending: false,
  });
  const isReady = useIndexedDBStatus();

  const depRef = useRef<any[]>(deps);

  if (!arrayEqual(deps, depRef.current)) {
    depRef.current = deps;
  }

  useEffect(() => {
    if (!DB_STORE_KEY) return;
    broadcastChannel.current = new BroadcastChannel(DB_STORE_KEY);
  }, [DB_STORE_KEY]);

  useEffect(() => {
    if (!isReady) return;
    const fn = async () => {
      setDBState((prev) => ({ ...prev, isPending: true }));
      try {
        const data = await db.query(filterFn, limit, offset);
        setDBState((prev) => ({
          ...prev,
          data,
          isPending: false,
          message: "Data Fetched Successfully",
        }));
      } catch (error) {
        console.log(error);
        setDBState((prev) => ({
          ...prev,
          isPending: false,
          error: true,
          // @ts-expect-error any
          message: error.message,
        }));
      }
    };

    fn();

    const bc = broadcastChannel.current;
    if (bc) {
      bc.onmessage = (_ev: MessageEvent<DataStoreMessage>) => {
        fn();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, depRef.current, limit, offset, isReady]);

  return { dbState };
}
