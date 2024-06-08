import { isServer } from "@/utils/utils";

type DBQueryKeyType = Parameters<IDBObjectStore["get"]>[0];

type DBIndexConfig<T> = {
  indexName: string;
  keyPath: keyof T & string;
  unique?: boolean;
};

export interface IDB<T> {
  name: string;
  db: IDBDatabase;
  addData: (data: T) => Promise<void>;
  updateData: (key: DBQueryKeyType, data: T) => Promise<void>;
  deleteData: (key: DBQueryKeyType) => Promise<void>;
  query: (
    filterFn?: (data: T) => boolean,
    limit?: number,
    offset?: number
  ) => Promise<T[]>;
  onDBRegistered: () => void;
}

export class DB<T> implements IDB<T> {
  name: string;
  db: IDBDatabase;
  onDBRegistered: () => void = () => {};

  /**
   * @returns IDB<T>
   */
  constructor(
    name: string,
    key: keyof T & string,
    config: DBIndexConfig<T>[],
    version?: number
  ) {
    this.name = name;
    this.db = null as any; // FIXME: can we tell typescript that db is sure to be initialized?

    if (isServer()) return;
    const request = indexedDB.open(name, version);

    request.onsuccess = (event) => {
      const db = (event.target as any)?.result as IDBDatabase;
      this.db = db;
      this.onDBRegistered();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as any)?.result as IDBDatabase;
      this.db = db;

      if (db.objectStoreNames.contains(name)) {
        db.deleteObjectStore(name);
      }

      const objectStore = db.createObjectStore(name, { keyPath: key });

      config.forEach((conf) => {
        objectStore.createIndex(conf.indexName, conf.keyPath, {
          unique: conf.unique || false,
        });
      });
    };
  }

  addData(data: T) {
    return new Promise<void>((resolve, reject) => {
      const objectStore = this.db
        .transaction(this.name, "readwrite")
        .objectStore(this.name);

      const request = objectStore.add(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject("Failed to Add Data");
      };

      objectStore.transaction.oncomplete = () => resolve();
      objectStore.transaction.onerror = () => {
        reject("Failed to Add Data");
      };
    });
  }

  updateData(key: IDBValidKey | IDBKeyRange, data: Partial<T>) {
    return new Promise<void>((resolve, reject) => {
      const objectStore = this.db
        .transaction(this.name, "readwrite")
        .objectStore(this.name);

      const request = objectStore.get(key);

      request.onsuccess = (ev) => {
        let updatedData = (ev.target as any).result as T;
        updatedData = { ...updatedData, ...data };
        objectStore.put(updatedData);
        resolve();
      };

      request.onerror = () => reject("Failed To Update Data");

      objectStore.transaction.oncomplete = () => resolve();
      objectStore.transaction.onerror = () => reject("Failed To Update Data");
    });
  }

  deleteData(key: IDBValidKey | IDBKeyRange) {
    return new Promise<void>((resolve, reject) => {
      const objectStore = this.db
        .transaction(this.name, "readwrite")
        .objectStore(this.name);

      const request = objectStore.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject("Failed To Delete Data");
      objectStore.transaction.oncomplete = () => resolve();
      objectStore.transaction.onerror = () => reject("Failed To Delete Data");
    });
  }

  async query(
    filterFn?: (data: T) => boolean,
    limit?: number | undefined,
    offset?: number | undefined
  ) {
    return new Promise((resolve: (value: T[]) => void, reject) => {
      const objectStore = this.db
        .transaction(this.name, "readonly")
        .objectStore(this.name);
      const res: T[] = [];
      let queried = 0;

      const resPromise = new Promise((resol: (value: T[]) => void) => {
        const objCursor = objectStore.openCursor();
        objCursor.onsuccess = (ev) => {
          const cursor = (ev.target as any).result as IDBCursorWithValue;
          if (!cursor) {
            resol(res);
            return;
          }

          if (offset) {
            offset -= 1;
            cursor.continue();
            return;
          }
          const canInclude = filterFn ? filterFn(cursor.value) : true;
          if (canInclude && (!limit || queried < limit)) {
            res.push(cursor.value);
          }
          cursor.continue();
          queried += 1;
        };
        objCursor.onerror = () => reject("Failed to Fetch Data");
      });

      objectStore.transaction.oncomplete = function () {
        resPromise.then(resolve).catch(reject);
      };

      objectStore.transaction.onerror = () => reject("Failed to Fetch Data");
    });
  }
}
