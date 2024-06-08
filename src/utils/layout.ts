import { Extension } from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";

export type Layout = keyof typeof LayoutObj;
export const LayoutObj = {
  CODE_LEFT_OUTPUT_RIGHT: "CODE_LEFT_OUTPUT_RIGHT",
  CODE_TOP_OUTPUT_BOTTOM: "CODE_TOP_OUTPUT_BOTTOM",
  CODE_RIGHT_OUTPUT_LEFT: "CODE_RIGHT_OUTPUT_LEFT",
} as const;

export type Language = "html" | "css" | "script";

export const languageLabels: Record<Language, string> = {
  html: "Html",
  css: "Css",
  script: "Script",
};

export const languageExtensions = (
  preprocessor: string
): Partial<Record<Language, Extension[]>> => ({
  html: [langs.html({ autoCloseTags: true, matchClosingTags: true })],
  css: [langs.css()],
  script: [
    langs.javascript({
      jsx: preprocessor === "react",
      typescript: preprocessor === "typescript" || preprocessor === "react",
    }),
  ],
});

export const isCodeLeft = (layout: Layout) =>
  layout === LayoutObj.CODE_LEFT_OUTPUT_RIGHT;
export const isCodeRight = (layout: Layout) =>
  layout === LayoutObj.CODE_RIGHT_OUTPUT_LEFT;
export const isCodeTop = (layout: Layout) =>
  layout === LayoutObj.CODE_TOP_OUTPUT_BOTTOM;
