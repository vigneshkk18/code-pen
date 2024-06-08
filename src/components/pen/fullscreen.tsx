"use client";

import Button from "@/components/ui/button";

import useCodeResize from "@/hooks/useCodeResize";
import useFullScreenObserver from "@/hooks/useFullScreenObserver";
import { toggleFullScreen } from "@/context/code-resize-ctx";

import { Language } from "@/utils/layout";

const languageToFullScreenNames: Record<Language, toggleFullScreen> = {
  html: "toggleHtmlFullScreen",
  css: "toggleCssFullScreen",
  script: "toggleScriptFullScreen",
};

export default function FullScreen({ language }: { language: Language }) {
  const { toggleFullScreenFnMap } = useCodeResize();
  const inFullScreen = useFullScreenObserver();

  const icon = inFullScreen ? "bx-exit-fullscreen" : "bx-fullscreen";

  return (
    <Button
      className="h-max px-2 py-1"
      onClick={toggleFullScreenFnMap[languageToFullScreenNames[language]]}
    >
      <i className={`bx ${icon}`}></i>
    </Button>
  );
}
