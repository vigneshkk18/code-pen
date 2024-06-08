import { Pen } from "@/types/pen";
import { FileSystemTree } from "@webcontainer/api";
import { files as packageJSONFile } from "@/utils/default-codes/package-json";
import { files as viteConfigFile } from "@/utils/default-codes/viteConfig";
import { files as htmlFile } from "@/utils/default-codes/html";
import { files as styleFile } from "@/utils/default-codes/style";
import { files as scriptFile } from "@/utils/default-codes/script";
import { files as reactEntryFile } from "@/utils/default-codes/react-entry";
import { Language } from "./layout";

export const htmlPreProcessorExtension: Record<string, string> = {
  none: ".html",
};

export const cssPreProcessorExtension: Record<string, string> = {
  none: ".css",
  scss: ".scss",
  sass: ".sass",
  less: ".less",
  styl: ".styl",
  stylus: ".stylus",
};

export const cssPreProcessorPkg: Record<string, string[]> = {
  none: [""],
  scss: ["sass"],
  sass: ["sass"],
  less: ["less"],
  styl: ["stylus"],
  stylus: ["stylus"],
};

export const scriptPreProcessorExtension: Record<string, string> = {
  none: ".js",
  typescript: ".ts",
  react: ".tsx",
};

export const scriptPreProcessorPkg: Record<string, string[]> = {
  none: [""],
  typescript: [""],
  react: ["react", "react-dom", "@vitejs/plugin-react"],
};

export const languageToFilePrefix: Record<Language, string> = {
  html: "index",
  css: "style",
  script: "script",
};

export const languageToExtensionMap: Record<
  Language,
  Record<string, string>
> = {
  html: htmlPreProcessorExtension,
  css: cssPreProcessorExtension,
  script: scriptPreProcessorExtension,
};

export const defaultFST: Record<Language, typeof htmlFile> = {
  html: htmlFile,
  css: styleFile,
  script: scriptFile,
};

export const transformPenToFileSystemTree = (pen: Pen) => {
  const fileSystemTree: FileSystemTree = {};
  fileSystemTree["index.html"] = htmlFile(pen.html, pen.extensionEnabled);
  fileSystemTree[
    `style${
      cssPreProcessorExtension[pen.extensionEnabled.css?.preprocessor || "none"]
    }`
  ] = styleFile(pen.css, pen.extensionEnabled);
  fileSystemTree[
    `script${
      scriptPreProcessorExtension[
        pen.extensionEnabled.script?.preprocessor || "none"
      ]
    }`
  ] = scriptFile(pen.script, pen.extensionEnabled);
  fileSystemTree["package.json"] = packageJSONFile;
  fileSystemTree["vite.config.js"] = viteConfigFile(pen.extensionEnabled);
  fileSystemTree["main.tsx"] = reactEntryFile;
  return fileSystemTree;
};

export const transformFileSystemTreeToPen = (
  fileSystemTree: FileSystemTree
) => {
  const pen: Partial<Pick<Pen, "html" | "css" | "script">> = {};
  pen.html =
    "file" in fileSystemTree.html
      ? (fileSystemTree.html.file.contents as string)
      : "";
  pen.css =
    "file" in fileSystemTree.css
      ? (fileSystemTree.css.file.contents as string)
      : "";
  pen.script =
    "file" in fileSystemTree.script
      ? (fileSystemTree.script.file.contents as string)
      : "";
  return pen as Pick<Pen, "html" | "css" | "script">;
};
