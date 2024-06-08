import { FileSystemTree } from "@webcontainer/api";

import { Pen } from "@/types/pen";

const reactImport = "import react from '@vitejs/plugin-react';";
const reactPlugin = "react(),";

export const files = (
  extensions?: Pen["extensionEnabled"]
): FileSystemTree["html"] => ({
  file: {
    contents: `
    ${extensions?.script?.preprocessor === "react" ? reactImport : ""}
    import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [${extensions?.script?.preprocessor === "react" ? reactPlugin : ""}],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});`,
  },
});
