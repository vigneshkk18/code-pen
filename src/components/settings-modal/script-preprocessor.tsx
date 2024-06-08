import { ChangeEventHandler, useState } from "react";

import useCodeStore from "@/hooks/useCodeStore";

import { files as htmlFile, defaultHTML } from "@/utils/default-codes/html";
import { files as viteFile } from "@/utils/default-codes/viteConfig";

import {
  scriptPreProcessorExtension,
  scriptPreProcessorPkg,
} from "@/utils/code";

import { Pen } from "@/types/pen";

interface ScriptPreProcessor {
  extension: Pen["extensionEnabled"] | undefined;
  updateExtension: (script: Pen["extensionEnabled"]) => void;
}

export default function ScriptPreProcessor({
  extension,
  updateExtension,
}: ScriptPreProcessor) {
  const { container } = useCodeStore();
  const [isPending, setIsPending] = useState(false);

  const onPreProcessorChange: ChangeEventHandler<HTMLSelectElement> = async (
    event
  ) => {
    if (!extension) return;
    setIsPending(true);
    const updatedExtension: Pen["extensionEnabled"] = {
      ...extension,
      script: { ...extension.script, preprocessor: event.target.value },
    };

    if (!container.instance) return;
    const newHtml = htmlFile(defaultHTML, updatedExtension);
    const htmlCode = "file" in newHtml ? newHtml.file.contents : "";

    const oldScriptPath = `script${
      scriptPreProcessorExtension[extension.script?.preprocessor || "none"]
    }`;
    const newScriptPath = `script${
      scriptPreProcessorExtension[
        updatedExtension.script?.preprocessor || "none"
      ]
    }`;
    const newPkgs =
      scriptPreProcessorPkg[updatedExtension.script?.preprocessor || "none"];

    const newViteConfig = viteFile(updatedExtension);
    const newViteConfigCode =
      "file" in newViteConfig ? newViteConfig.file.contents : "";

    if (updatedExtension.script?.packages) {
      updatedExtension.script.packages = Array.from(
        new Set(
          [...updatedExtension.script.packages, ...newPkgs].filter(
            (pkg) => pkg.trim().length
          )
        )
      );
    }

    try {
      updateExtension(updatedExtension);
      const p1 = await container.instance.spawn("npm", ["i", ...newPkgs]);
      p1.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );
      await p1.exit;
      await Promise.allSettled([
        container.instance.fs.writeFile("vite.config.js", newViteConfigCode),
        container.instance.fs.writeFile("index.html", htmlCode),
        container.instance.fs.rename(oldScriptPath, newScriptPath),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-[#252830] relative before:h-full before:w-[2px] before:bg-[#444857] before:absolute before:top-0 before:left-0 p-4 ">
      <h3 className="text-xl">JavaScript Preprocessor</h3>
      <select
        value={extension?.script?.preprocessor || "none"}
        onChange={onPreProcessorChange}
        disabled={isPending}
        className={`bg-[#e3e4e8] text-[#8f8f90] w-full border-0 p-1 mt-4 ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <option value="none">None</option>
        <option value="typescript">Typescript</option>
        <option value="react">React</option>
      </select>
    </div>
  );
}
