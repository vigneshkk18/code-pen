import { Pen } from "@/types/pen";

interface PackagesList {
  extension: Pen["extensionEnabled"] | undefined;
  updateExtension: (script: Pen["extensionEnabled"]) => void;
}

export default function PackagesList({
  extension,
  updateExtension,
}: PackagesList) {
  const removePackage = (packagename: string) => () => {
    if (!extension) return;
    let updatedPackages = new Set([
      ...(extension?.script?.packages || []),
      packagename,
    ]);
    updatedPackages.delete(packagename);
    updateExtension({
      ...extension,
      script: {
        ...extension.script,
        packages: Array.from(updatedPackages),
      },
    });
  };

  return (
    <ul className="flex gap-2 flex-wrap my-4">
      {(extension?.script?.packages || []).map((pkg, index) => (
        <li
          key={`${pkg}-index`}
          className="border border-[#e3e4e8] rounded flex items-stretch gap-1"
        >
          <span className="p-1 px-2">{pkg}</span>
          <i
            onClick={removePackage(pkg)}
            className="bx bxs-trash bg-red-500 text-white rounded-e flex items-center px-1 cursor-pointer"
          ></i>
        </li>
      ))}
    </ul>
  );
}
