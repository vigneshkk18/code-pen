import { useDeferredValue, useEffect, useState } from "react";

import { usePen } from "@/context/pen-ctx";
import useCodeStore from "@/hooks/useCodeStore";

import { Language } from "@/utils/layout";
import {
  defaultFST,
  languageToExtensionMap,
  languageToFilePrefix,
} from "@/utils/code";

export default function useCode(language: Language) {
  const { pen, updatePen } = usePen();
  const { setPending, container } = useCodeStore();
  const [code, setCode] = useState("");
  const debouncedCode = useDeferredValue(code);

  useEffect(() => {
    if (!!code || !pen) return;
    setCode(pen[language]);
  }, [pen, language]);

  useEffect(() => {
    setPending(true);
    updatePen((prev) => (prev ? { ...prev, [language]: debouncedCode } : prev));

    const fn = async () => {
      if (!container.instance) return;
      const defaultTemplate = defaultFST[language](
        debouncedCode,
        pen?.extensionEnabled
      );
      const code =
        "file" in defaultTemplate ? defaultTemplate.file.contents : "";
      const fileName = `${languageToFilePrefix[language]}${
        languageToExtensionMap[language][
          pen?.extensionEnabled?.[language]?.preprocessor || "none"
        ]
      }`;
      await container.instance.fs.writeFile(fileName, code);
      setPending(false);
    };
    const timer = setTimeout(fn, 1000);
    return () => clearTimeout(timer);
  }, [debouncedCode, container.instance, pen?.extensionEnabled]);

  const updateCode = (value: string) => {
    setCode(value);
  };

  return { code: code, updateCode };
}
