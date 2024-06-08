"use client";

import ReactCodeMirror from "@uiw/react-codemirror";

import Header from "@/components/pen/header";
import CodeResizer from "@/components/pen/code-resizer";

import useCode from "@/hooks/useCode";
import { usePen } from "@/context/pen-ctx";

import { Language, languageExtensions } from "@/utils/layout";

interface CodeContainer {
  language: Language;
  canResizeX?: boolean;
}

export default function CodeContainer({
  language,
  canResizeX = true,
}: CodeContainer) {
  const { pen } = usePen();
  const { code, updateCode } = useCode(language);

  const preprocessor =
    pen?.extensionEnabled?.[language]?.preprocessor || "none";

  return (
    <>
      <div
        className={`flex flex-col w-full border border-[#34363e] select-none ${language}-blockX`}
      >
        <Header language={language} />
        <ReactCodeMirror
          className={`${language}-blockY`}
          theme="dark"
          value={code}
          onChange={updateCode}
          height="0px"
          extensions={languageExtensions(preprocessor)?.[language]}
        />
      </div>
      <CodeResizer canResizeX={canResizeX} language={language} />
    </>
  );
}
