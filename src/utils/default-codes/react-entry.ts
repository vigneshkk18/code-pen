import { FileSystemTree } from "@webcontainer/api";

export const files: FileSystemTree["react-entry"] = {
  file: {
    contents: `
      import ReactDom from "react-dom/client";
      import App from "./script";

      const root = ReactDom.createRoot(document.getElementById("root"));
      root.render(<App />);
      `,
  },
};
