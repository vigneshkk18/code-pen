import { FileSystemTree } from "@webcontainer/api";

export const files: FileSystemTree["package-json"] = {
  file: {
    contents: `
{
  "name": "code-pen",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {},
  "devDependencies": {}
}    
    `,
  },
};
