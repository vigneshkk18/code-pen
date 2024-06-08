import useCodeResize from "@/hooks/useCodeResize";

import { Language, isCodeTop } from "@/utils/layout";
import { languageToResizeNames } from "@/utils/resize/common";

interface CodeResizer {
  canResizeX: boolean;
  language: Language;
}

export default function CodeResizer({ canResizeX, language }: CodeResizer) {
  const { layout, resizeFnMap } = useCodeResize();

  return (
    <div
      onPointerDown={resizeFnMap[languageToResizeNames[language]]}
      className={`${
        canResizeX ? "" : "hidden"
      } ${language}-handleX cursor-all-scroll ${
        isCodeTop(layout) ? "w-[18px] h-full" : "w-0 h-0"
      }`}
    ></div>
  );
}
