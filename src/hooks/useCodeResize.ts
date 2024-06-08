import { useContext } from "react";

import { CodeResize } from "@/context/code-resize-ctx";

export default function useCodeResize() {
  return useContext(CodeResize);
}
