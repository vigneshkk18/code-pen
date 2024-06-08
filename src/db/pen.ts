import { DB } from ".";
import { Pen as IPen } from "@/types/pen";

export const PEN_DB_STORE_KEY = "PEN_DB_STORE";

class Pen extends DB<IPen> {
  constructor() {
    super(
      "pen",
      "id",
      [
        { indexName: "title", keyPath: "title" },
        { indexName: "id", keyPath: "id" },
      ],
      2
    );
  }
}

let penDB: Pen | null = null;
export const getPenDB = () => {
  if (penDB) return penDB;
  penDB = new Pen();
  return penDB;
};

getPenDB();
