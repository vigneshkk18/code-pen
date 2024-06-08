import {
  Section,
  onResize,
  position,
  refs,
  sections,
} from "@/context/code-resize-ctx";

import { Language, Layout, isCodeTop } from "@/utils/layout";
import { getSizeBasedOnLayout as getHtmlSizeBasedOnLayout } from "@/utils/resize/html";
import { getSizeBasedOnLayout as getGroupSizeBasedOnLayout } from "@/utils/resize/group";
import { getSizeBasedOnLayout as getScriptSizeBasedOnLayout } from "@/utils/resize/script";
import { getSizeBasedOnLayout as getCssSizeBasedOnLayout } from "@/utils/resize/css";

export const capturePointerDownPosition = (
  event: MouseEvent,
  element: Section
) => {
  position[element].handleX.x = event.clientX;
  position[element].handleX.y = event.clientY;

  position[element].handleY.x = event.clientX;
  position[element].handleY.y = event.clientY;

  const blockX = refs[element].blockX;
  if (blockX) {
    const blockXStyles = getComputedStyle(blockX);
    position[element].blockX.w = parseInt(blockXStyles.width);
    position[element].blockX.h = parseInt(blockXStyles.height);
  }

  const blockY = refs[element].blockY;
  if (blockY) {
    const blockYStyles = getComputedStyle(blockY);
    position[element].blockY.w = parseInt(blockYStyles.width);
    position[element].blockY.h = parseInt(blockYStyles.height);
  }
};

export const updateDimensions = () => {
  sections.forEach((section) => {
    const blockX = refs[section].blockX;
    if (blockX) {
      const blockXStyles = getComputedStyle(blockX);
      position[section].blockX.w = parseInt(blockXStyles.width);
      position[section].blockX.h = parseInt(blockXStyles.height);
    }

    const blockY = refs[section].blockY;
    if (blockY) {
      const blockYStyles = getComputedStyle(blockY);
      position[section].blockY.w = parseInt(blockYStyles.width);
      position[section].blockY.h = parseInt(blockYStyles.height);
    }
  });
};

const sectionSizeBasedOnLayout: Record<Section, (layout: Layout) => number> = {
  html: getHtmlSizeBasedOnLayout,
  css: getCssSizeBasedOnLayout,
  script: getScriptSizeBasedOnLayout,
  group: getGroupSizeBasedOnLayout,
  console: () => 0,
};

export const resizeSectionToDefaults = (layout: Layout) => {
  sections.forEach((section) => {
    const blockXEl = refs[section].blockX;
    const blockYEl = refs[section].blockY;
    if (blockXEl && blockYEl) {
      if (["html", "css", "script", "console"].includes(section)) {
        if (isCodeTop(layout)) {
          blockXEl.style.width = `${sectionSizeBasedOnLayout[section](
            layout
          )}px`;
          blockXEl.style.height = "";
          blockYEl.style.height = "100%";
        } else {
          blockYEl.style.height = `${sectionSizeBasedOnLayout[section](
            layout
          )}px`;
          blockYEl.style.width = "";
          blockXEl.style.width = "";
        }
      } else {
        if (isCodeTop(layout)) {
          blockYEl.style.height = "100%";
          blockXEl.style.height = `${sectionSizeBasedOnLayout[section](
            layout
          )}px`;
          blockXEl.style.width = "";
        } else {
          blockYEl.style.width = `${sectionSizeBasedOnLayout[section](
            layout
          )}px`;
          blockYEl.style.height = "";
        }
      }
    }
  });
};

const cssIcon = (preprocessor: string) => {
  if (preprocessor === "scss" || preprocessor === "sass")
    return "bxl-sass text-[#bf4080]";
  if (preprocessor === "less") return "bxl-less text-[#1d365d]";
  return "bxl-css3 text-[#38bdf8]";
};

const scriptIcon = (preprocessor: string) => {
  if (preprocessor === "react") return "bxl-react text-[#58c4dc]";
  if (preprocessor === "typescript") return "bxl-typescript text-[#3178c6]";
  return "bxl-javascript text-[#efd81d]";
};

export const languageIconCls = (
  preprocessor: string
): Record<Language | "console", string> => ({
  html: "bx bxl-html5 text-red-500",
  css: `bx ${cssIcon(preprocessor)}`,
  script: `bx ${scriptIcon(preprocessor)}`,
  console: "bx bxl-slack-old text-[#666666]",
});

export const languageToResizeNames: Record<Language, onResize> = {
  html: "onHtmlResize",
  css: "onCssResize",
  script: "onScriptResize",
};
