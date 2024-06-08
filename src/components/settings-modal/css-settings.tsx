import { ChangeEventHandler, useState } from "react";

import useCodeStore from "@/hooks/useCodeStore";

import { cssPreProcessorExtension, cssPreProcessorPkg } from "@/utils/code";
import { files as htmlFile, defaultHTML } from "@/utils/default-codes/html";

import { Pen } from "@/types/pen";

interface CSSSettings {
  extension: Pen["extensionEnabled"] | undefined;
  updateExtension: (extension: Pen["extensionEnabled"]) => void;
}

export default function CSSSettings({
  extension,
  updateExtension,
}: CSSSettings) {
  const [isPending, setIsPending] = useState(false);
  const { container } = useCodeStore();

  const onPreProcessorChange: ChangeEventHandler<HTMLSelectElement> = async (
    event
  ) => {
    if (!extension) return;
    setIsPending(true);
    const updatedExtension: Pen["extensionEnabled"] = {
      ...extension,
      css: { ...extension.css, preprocessor: event.target.value },
    };

    if (!container.instance) return;
    const newHtml = htmlFile(defaultHTML, updatedExtension);
    const htmlCode = "file" in newHtml ? newHtml.file.contents : "";

    const oldCssPath = `style${
      cssPreProcessorExtension[extension.css?.preprocessor || "none"]
    }`;
    const newCssPath = `style${
      cssPreProcessorExtension[updatedExtension.css?.preprocessor || "none"]
    }`;

    const cssPkgs =
      cssPreProcessorPkg[updatedExtension.css?.preprocessor || "none"];

    try {
      let pkgs = [...(updatedExtension.script?.packages || [])];
      if (pkgs) pkgs = [...pkgs, ...cssPkgs];
      updatedExtension.script = { ...updatedExtension.script, packages: pkgs };

      updateExtension(updatedExtension);
      const p1 = await container.instance.spawn("npm", ["i", ...cssPkgs]);
      p1.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );
      await p1.exit;
      await Promise.allSettled([
        container.instance.fs.writeFile("index.html", htmlCode),
        container.instance.fs.rename(oldCssPath, newCssPath),
      ]);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-4 w-full">
      <div className="bg-[#252830] relative before:h-full before:w-[2px] before:bg-[#444857] before:absolute before:top-0 before:left-0 p-4 ">
        <h3 className="text-xl">CSS Preprocessor</h3>
        <select
          value={extension?.css?.preprocessor || "none"}
          onChange={onPreProcessorChange}
          disabled={isPending}
          className={`bg-[#e3e4e8] text-[#8f8f90] w-full border-0 p-1 mt-4 ${
            isPending ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <option value="none">None</option>
          <option value="scss">SCSS</option>
          <option value="sass">SASS</option>
          <option value="less">LESS</option>
          <option value="styl">STYL</option>
          <option value="stylus">STYLUS</option>
        </select>
      </div>
    </div>
  );
}
