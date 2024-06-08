import { FileSystemTree } from "@webcontainer/api";

import { Pen } from "@/types/pen";

export const defaultScript = `console.log("Code Pen Started");`;

export const files = (
  code: string,
  _extension?: Pen["extensionEnabled"]
): FileSystemTree["script"] => ({
  file: {
    contents: `${code}`,
  },
});
