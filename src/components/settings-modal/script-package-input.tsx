import { useDeferredValue, useEffect, useState } from "react";

import useCodeStore from "@/hooks/useCodeStore";

import { Pen } from "@/types/pen";
import { NPMResponse } from "@/types/npm";

interface ScriptPackageInput {
  extension: Pen["extensionEnabled"] | undefined;
  updateExtension: (script: Pen["extensionEnabled"]) => void;
}

export default function ScriptPackageInput({
  extension,
  updateExtension,
}: ScriptPackageInput) {
  const [pkg, setPkg] = useState("");
  const [pkgResult, setPkgResult] = useState<{ key: string; label: string }[]>(
    []
  );
  const { addDep } = useCodeStore();
  const debouncedPkg = useDeferredValue(pkg);

  useEffect(() => {
    const queryNPMList = async () => {
      try {
        const res = (await fetch(
          `https://registry.npmjs.com/-/v1/search?text=${debouncedPkg}&size=5`
        ).then((res) => res.json())) as NPMResponse;
        const pkgList = res.objects.map((pkg) => ({
          key: pkg.package.name,
          label: `${pkg.package.name}@${pkg.package.version}`,
        }));
        setPkgResult(pkgList);
      } catch (error: any) {
        console.error(error);
      }
    };

    const timer = setTimeout(queryNPMList, 1000);
    return () => clearTimeout(timer);
  }, [debouncedPkg]);

  const addPackage = (packagename: string) => () => {
    if (!extension) return;
    const updatedPackages = Array.from(
      new Set([...(extension?.script?.packages || []), packagename])
    );
    updateExtension({
      ...extension,
      script: {
        ...extension.script,
        packages: updatedPackages,
      },
    });
    addDep(packagename);
  };

  return (
    <>
      <div className="flex items-center pl-2 bg-[#e3e4e8] text-[#8f8f90]">
        <i className="bx bx-search text-xl text-[#535557]"></i>
        <input
          value={pkg}
          onChange={(e) => setPkg(e.target.value)}
          className="bg-transparent border-0 outline-0 flex-grow px-4 py-2"
        />
      </div>
      <ul className="flex flex-col gap-1 mt-2">
        {pkgResult.length
          ? pkgResult.map((pkg) => (
              <li
                onClick={addPackage(pkg.key)}
                className="w-full p-2 rounded bg-[#131417] cursor-pointer"
                key={pkg.key}
              >
                {pkg.label}
              </li>
            ))
          : null}
      </ul>
    </>
  );
}
