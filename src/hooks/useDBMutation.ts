import { useEffect, useRef, useState } from "react";

import { DB } from "@/db";

interface MutationState<T> {
  isPending: boolean;
  error: boolean;
  message: string;
  data: T[];
}

export interface DataStoreMessage {
  type: "add" | "update" | "delete" | "query";
  message: string;
}

export default function useDBMutation<T>(db: DB<T>, DATA_STORE_KEY?: string) {
  const broadcastBanner = useRef<BroadcastChannel | null>(null);
  const [mutationState, setMutationState] = useState<MutationState<T>>({
    isPending: false,
    error: false,
    message: "",
    data: [],
  });

  useEffect(() => {
    if (!DATA_STORE_KEY) return;
    broadcastBanner.current = new BroadcastChannel(DATA_STORE_KEY);
  }, [DATA_STORE_KEY]);

  const asyncWrapper = async (
    fn: (...args: any[]) => Promise<void | T[]>,
    type: DataStoreMessage["type"],
    successMsg: string,
    ...args: any[]
  ) => {
    try {
      setMutationState({ ...mutationState, isPending: true, error: false });
      const data = await fn.bind(db)(...args);
      setMutationState({
        ...mutationState,
        isPending: false,
        message: successMsg,
        data: data ? data : [],
      });
      if (broadcastBanner.current) {
        broadcastBanner.current.postMessage({
          type,
          message: successMsg,
        } as DataStoreMessage);
      }
      return data;
    } catch (error: any) {
      console.error(error);
      setMutationState({
        ...mutationState,
        isPending: false,
        message: error.message,
        error: true,
      });
    }
    return null;
  };

  const addData: DB<T>["addData"] = async (data) => {
    await asyncWrapper(db.addData, "add", "Data Added Successfully", data);
  };

  const updateData: DB<T>["updateData"] = async (key, data) => {
    await asyncWrapper(
      db.updateData,
      "update",
      "Data Updated Successfully",
      key,
      data
    );
  };

  const deleteData: DB<T>["deleteData"] = async (key) => {
    await asyncWrapper(
      db.deleteData,
      "delete",
      "Data Deleted Successfully",
      key
    );
  };

  const queryData: DB<T>["query"] = async (filterFn, limit, offset) => {
    const res = await asyncWrapper(
      db.query,
      "query",
      "Data Fetched Successfully",
      filterFn,
      limit,
      offset
    );
    return res ? res : [];
  };

  return {
    addData,
    updateData,
    deleteData,
    response: mutationState,
    queryData,
  };
}
