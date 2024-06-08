import ScriptPackages from "@/components/settings-modal/script-packages";
import ScriptPreProcessor from "@/components/settings-modal/script-preprocessor";

import { Pen } from "@/types/pen";

interface ScriptSettings {
  extension: Pen["extensionEnabled"] | undefined;
  updateExtension: (extension: Pen["extensionEnabled"]) => void;
}

export default function ScriptSettings({
  extension,
  updateExtension,
}: ScriptSettings) {
  return (
    <div className="mx-4 w-full flex flex-col gap-4">
      <ScriptPreProcessor
        extension={extension}
        updateExtension={updateExtension}
      />
      <ScriptPackages extension={extension} updateExtension={updateExtension} />
    </div>
  );
}
