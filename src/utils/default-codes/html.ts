import { FileSystemTree } from "@webcontainer/api";

import { Pen } from "@/types/pen";
import { cssPreProcessorExtension, scriptPreProcessorExtension } from "../code";

export const defaultHTML = `<h3>
  Start Editing html, css, script files to see changes.
</h3>
`;

export const defaultImport = (extension?: Pen["extensionEnabled"]) =>
  `<script type="module" src="/script${
    scriptPreProcessorExtension[extension?.script?.preprocessor || "none"]
  }"></script>`;
export const reactImport = '<script type="module" src="/main.tsx"></script>';

const reactHelper = `<div id="root"></div>`;

export function files(
  code: string,
  extension?: Pen["extensionEnabled"]
): FileSystemTree["html"] {
  const isReact = extension?.script?.preprocessor === "react";
  return {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodePen Clone</title>
    <link rel="stylesheet" href="/style${
      cssPreProcessorExtension[extension?.css?.preprocessor || "none"]
    }" />
    ${isReact ? reactImport : defaultImport(extension)}
  </head>
  <body>
    ${extension?.script?.preprocessor === "react" ? reactHelper : code}
  </body>
</html>`,
    },
  };
}
