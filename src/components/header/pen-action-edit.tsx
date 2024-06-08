import { useParams, useLocation } from "wouter";

import Layout from "@/components/header/layout";
import Button from "@/components/ui/button";

import { getPenDB } from "@/db";

const penDb = getPenDB();

export default function PenActionEdit() {
  const { penId } = useParams<{ penId: string }>();
  const [, redirect] = useLocation();

  const deletePen = async () => {
    await penDb.deleteData(penId);
    redirect("/pens");
  };

  return (
    <div className="flex gap-2 items-stretch">
      <Button onClick={deletePen} className="bg-red-500 hover:bg-red-400">
        <i className="bx bxs-trash mr-1"></i> Delete
      </Button>
      <Layout />
    </div>
  );
}
