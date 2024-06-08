import { useParams, useSearch } from "wouter";

import Tabs from "@/components/settings-modal/tabs";
import CSSSettings from "@/components/settings-modal/css-settings";
import ScriptSettings from "@/components/settings-modal/script-settings";

import { usePen } from "@/context/pen-ctx";

import { getPenDB } from "@/db";

import { Pen } from "@/types/pen";

const penDb = getPenDB();

export default function Content() {
  const search = useSearch();
  const { penId } = useParams<{ penId: string }>();
  const { pen, updatePen } = usePen();

  const searchParams = new URLSearchParams(search);
  const isCssSelected = searchParams.get("settings") === "css";
  const isScriptSelected = searchParams.get("settings") === "script";

  const updateExtension = (extension: Pen["extensionEnabled"]) => {
    const updatedExtension = { ...extension };
    penDb.updateData(penId, { extensionEnabled: updatedExtension });
    updatePen(pen ? { ...pen, extensionEnabled: updatedExtension } : pen);
  };

  return (
    <div className="flex w-full my-4">
      <Tabs />
      {isCssSelected && (
        <CSSSettings
          extension={pen?.extensionEnabled}
          updateExtension={updateExtension}
        />
      )}
      {isScriptSelected && (
        <ScriptSettings
          extension={pen?.extensionEnabled}
          updateExtension={updateExtension}
        />
      )}
    </div>
  );
}
