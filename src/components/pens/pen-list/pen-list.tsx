import NoPen from "./no-data";
import Pen from "@/components/pens/pen-list/pen";
import useDBQuery from "@/hooks/useDBQuery";
import { PEN_DB_STORE_KEY, getPenDB } from "@/db";

interface PenList {
  search: string;
}

const penDB = getPenDB();

export default function PenList({ search }: PenList) {
  const { dbState } = useDBQuery(
    penDB,
    PEN_DB_STORE_KEY,
    (data) => {
      if (!search.trim().length) return true;
      return (
        !search.trim() ||
        data.title.toLowerCase().includes(search.toLowerCase())
      );
    },
    [search]
  );

  if (!dbState.data.length) return <NoPen />;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {dbState.data.map((pen) => (
        <Pen key={pen.id} {...pen} />
      ))}
    </ul>
  );
}
