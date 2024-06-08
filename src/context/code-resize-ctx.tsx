import {
  MouseEventHandler,
  PointerEventHandler,
  PropsWithChildren,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { Layout, LayoutObj } from "@/utils/layout";
import { onCSSPointerDown } from "@/utils/resize/css";
import { onHTMLPointerDown } from "@/utils/resize/html";
import { onGroupPointerDown } from "@/utils/resize/group";
import { onScriptPointerDown } from "@/utils/resize/script";
import { onConsolePointerDown } from "@/utils/resize/console";
import { resizeSectionToDefaults } from "@/utils/resize/common";

export const sections: Section[] = [
  "html",
  "css",
  "script",
  "console",
  "group",
];

export type Section = "html" | "css" | "script" | "console" | "group";
interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}
export type onResize = `on${Capitalize<Section>}Resize`;
export type toggleFullScreen = `toggle${Capitalize<Section>}FullScreen`;
type onResizeFnMap = {
  [key in onResize]: MouseEventHandler<HTMLElement>;
};
type onToggleFullScreenFnMap = {
  [key in toggleFullScreen]?: MouseEventHandler<HTMLButtonElement>;
};

type Refs = Record<
  Section,
  Record<"handleX" | "handleY" | "blockX" | "blockY", HTMLElement | null>
>;
type Positions = Record<
  Section,
  Record<"handleX" | "handleY" | "blockX" | "blockY", Position>
>;
interface State {
  layout: Layout;
  resizeFnMap: onResizeFnMap;
  toggleFullScreenFnMap: onToggleFullScreenFnMap;
}

const getSectionDefaultRefs = () =>
  sections.reduce((acc, section) => {
    acc[section] = { handleX: null, handleY: null, blockX: null, blockY: null };
    return acc;
  }, {} as Refs);

const getDefaultPosition = (): Position => ({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
});

const getSectionDefaultPosition = () =>
  sections.reduce((acc, section) => {
    acc[section] = {
      handleX: getDefaultPosition(),
      handleY: getDefaultPosition(),
      blockX: getDefaultPosition(),
      blockY: getDefaultPosition(),
    };
    return acc;
  }, {} as Positions);

export const refs = getSectionDefaultRefs();
export const position = getSectionDefaultPosition();

export const CodeResize = createContext<State>({
  layout: LayoutObj.CODE_LEFT_OUTPUT_RIGHT,
  resizeFnMap: {
    onHtmlResize() {},
    onCssResize() {},
    onScriptResize() {},
    onConsoleResize() {},
    onGroupResize() {},
  },
  toggleFullScreenFnMap: {
    toggleHtmlFullScreen() {},
    toggleCssFullScreen() {},
    toggleScriptFullScreen() {},
  },
});

export default function CodeResizeCtx({ children }: PropsWithChildren) {
  const [layout, setLayout] = useState<Layout>(
    LayoutObj.CODE_LEFT_OUTPUT_RIGHT
  );

  useEffect(() => {
    setLayout(
      JSON.parse(localStorage.getItem("layout") || "null") ||
        LayoutObj.CODE_LEFT_OUTPUT_RIGHT
    );
    const bc = new BroadcastChannel("layout-change");
    bc.onmessage = (event) => {
      setLayout(event.data);
      localStorage.setItem("layout", JSON.stringify(event.data));
    };
  }, []);

  useLayoutEffect(() => {
    const resizeSectionFn = () => resizeSectionToDefaults(layout);
    resizeSectionFn();
    window.addEventListener("resize", resizeSectionFn);

    sections.forEach((section) => {
      const handleX = `${section}-handleX`;
      const handleY = `${section}-handleY`;
      const blockX = `${section}-blockX`;
      const blockY = `${section}-blockY`;
      const handleXEl = document.querySelector(
        `.${handleX}`
      ) as HTMLElement | null;
      const handleYEl = document.querySelector(
        `.${handleY}`
      ) as HTMLElement | null;
      const blockXEl = document.querySelector(
        `.${blockX}`
      ) as HTMLElement | null;
      const blockYEl = document.querySelector(
        `.${blockY}`
      ) as HTMLElement | null;

      if (!handleXEl || !handleYEl || !blockXEl || !blockYEl) return;

      refs[section].handleX = handleXEl;
      refs[section].handleY = handleYEl;
      refs[section].blockX = blockXEl;
      refs[section].blockY = blockYEl;

      const handleXStyles = getComputedStyle(handleXEl);
      position[section].handleX.w = parseInt(handleXStyles.width);
      position[section].handleX.h = parseInt(handleXStyles.height);

      const handleYStyles = getComputedStyle(handleYEl);
      position[section].handleY.w = parseInt(handleYStyles.width);
      position[section].handleY.h = parseInt(handleYStyles.height);

      const blockXStyles = getComputedStyle(blockXEl);
      position[section].blockX.w = parseInt(blockXStyles.width);
      position[section].blockX.h = parseInt(blockXStyles.height);

      const blockYStyles = getComputedStyle(blockYEl);
      position[section].blockY.w = parseInt(blockYStyles.width);
      position[section].blockY.h = parseInt(blockYStyles.height);
    });

    return () => {
      window.removeEventListener("resize", resizeSectionFn);
    };
  }, [layout]);

  const onHtmlResize: PointerEventHandler<HTMLElement> = (event) => {
    onHTMLPointerDown(event, layout);
  };

  const onCssResize: PointerEventHandler<HTMLElement> = (event) => {
    onCSSPointerDown(event, layout);
  };

  const onScriptResize: PointerEventHandler<HTMLElement> = (event) => {
    onScriptPointerDown(event, layout);
  };

  const onGroupResize: PointerEventHandler<HTMLElement> = (event) => {
    onGroupPointerDown(event, layout);
  };

  const onConsoleResize: PointerEventHandler<HTMLElement> = (event) => {
    onConsolePointerDown(event, layout);
  };

  const toggleHtmlFullScreen: MouseEventHandler<HTMLElement> = (event) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    refs.html.blockX?.requestFullscreen();
  };

  const toggleCssFullScreen: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    refs.css.blockX?.requestFullscreen();
  };

  const toggleScriptFullScreen: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    refs.script.blockX?.requestFullscreen();
  };

  return (
    <CodeResize.Provider
      value={{
        layout,
        resizeFnMap: {
          onHtmlResize,
          onCssResize,
          onScriptResize,
          onConsoleResize,
          onGroupResize,
        },
        toggleFullScreenFnMap: {
          toggleHtmlFullScreen,
          toggleCssFullScreen,
          toggleScriptFullScreen,
        },
      }}
    >
      {children}
    </CodeResize.Provider>
  );
}
