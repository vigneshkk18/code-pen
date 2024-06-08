import PackagesList from "@/components/settings-modal/packages-list";
import ScriptPackageInput from "@/components/settings-modal/script-package-input";

import { Pen } from "@/types/pen";

interface ScriptPackages {
  extension: Pen["extensionEnabled"] | undefined;
  updateExtension: (script: Pen["extensionEnabled"]) => void;
}

export default function ScriptPackages({
  extension,
  updateExtension,
}: ScriptPackages) {
  return (
    <div className="bg-[#252830] relative before:h-full before:w-[2px] before:bg-[#444857] before:absolute before:top-0 before:left-0 p-4 max-h-[510px] overflow-y-auto">
      <h3 className="text-xl">Add Packages</h3>
      <p className="text-sm my-2">
        Search for and use JavaScript packages from npm. By selecting a package,
        an import statement will be added to the top of the JavaScript editor
        for this package.
      </p>
      <PackagesList extension={extension} updateExtension={updateExtension} />
      <ScriptPackageInput
        extension={extension}
        updateExtension={updateExtension}
      />
    </div>
  );
}
