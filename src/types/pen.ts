interface CSSExtension {
  preprocessor: string;
}

interface ScriptExtension {
  preprocessor: string;
  packages: string[];
}

export interface Pen {
  id: string;
  title: string;
  html: string;
  css: string;
  script: string;
  extensionEnabled: Partial<{
    html: Partial<Record<string, string>>;
    css: Partial<CSSExtension>;
    script: Partial<ScriptExtension>;
  }>;
}
