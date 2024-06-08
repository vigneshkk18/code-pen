import { FileSystemTree } from "@webcontainer/api";

import { Pen } from "@/types/pen";

export const defaultCSS = `h3 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
`;

export const files = (
  code: string,
  _extension?: Pen["extensionEnabled"]
): FileSystemTree["css"] => ({
  file: {
    contents: `${code}`,
  },
});
