import shortUUID from "short-uuid";
import { useLocation } from "wouter";

import Button from "@/components/ui/button";

import useDBMutation from "@/hooks/useDBMutation";

import { PEN_DB_STORE_KEY, getPenDB } from "@/db";
import { defaultHTML } from "@/utils/default-codes/html";
import { defaultCSS } from "@/utils/default-codes/style";
import { defaultScript } from "@/utils/default-codes/script";

import { Pen } from "@/types/pen";

const penDB = getPenDB();

export default function NewPen() {
  const { addData } = useDBMutation(penDB, PEN_DB_STORE_KEY);
  const [, redirect] = useLocation();

  const createNewPen = async () => {
    const newPen: Pen = {
      id: shortUUID.generate(),
      title: "Untitled",
      html: defaultHTML,
      css: defaultCSS,
      script: defaultScript,
      extensionEnabled: {
        html: {},
        css: {},
        script: { packages: ["vite"] },
      },
    };
    await addData(newPen);
    redirect("/pens/" + newPen.id);
  };

  return (
    <Button variant="success" onClick={createNewPen}>
      <span>New Pen</span>
    </Button>
  );
}
