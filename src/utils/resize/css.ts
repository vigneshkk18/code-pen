import { PointerEvent as ReactPointerEvent } from "react";

import { refs, position } from "@/context/code-resize-ctx";

import { Layout, isCodeTop } from "@/utils/layout";
import {
  capturePointerDownPosition,
  updateDimensions,
} from "@/utils/resize/common";

export function getSizeBasedOnLayout(layout: Layout) {
  if (isCodeTop(layout)) return (window.innerWidth - 18 * 2) / 3;

  // 68 - header, 50 - code block header, 2 - border
  return (window.innerHeight - 68 - 50 * 3 - 2 * 3) / 3;
}

export const onCSSPointerDown = (
  event: ReactPointerEvent<HTMLElement>,
  layout: Layout
) => {
  capturePointerDownPosition(event as unknown as PointerEvent, "css");
  if (isCodeTop(layout)) onCSSPointerDownX(event as unknown as PointerEvent);
  else onCSSPointerDownY(event as unknown as PointerEvent);
};

const onCSSPointerDownX = (event: PointerEvent) => {
  refs.css.handleX?.setPointerCapture(event.pointerId);

  window.addEventListener("pointermove", onPointerMoveX);
  window.addEventListener("pointerup", onPointerUpX);
  window.addEventListener("pointercancel", onPointerUpX);
};

const onCSSPointerDownY = (event: PointerEvent) => {
  refs.css.handleY?.setPointerCapture(event.pointerId);

  window.addEventListener("pointermove", onPointerMoveY);
  window.addEventListener("pointerup", onPointerUpY);
  window.addEventListener("pointercancel", onPointerUpY);
};

const onPointerMoveX = (event: PointerEvent) => {
  const dx = event.clientX - position.css.handleX.x;

  let newCssWidth = position.css.blockX.w + dx;
  let newScriptWidth = position.script.blockX.w - dx;
  let newHtmlWidth = position.html.blockX.w;
  // if css container width is less than zero remove from html container
  if (newCssWidth < 0) newHtmlWidth += dx;

  newCssWidth = newCssWidth || 0; // minimum zero width.

  // should not allow to resize once all other containers are of zero width.
  if (newScriptWidth < 0 || newHtmlWidth < 0) return;

  const htmlGroup = refs.html.blockX,
    cssGroup = refs.css.blockX,
    scriptGroup = refs.script.blockX;
  if (!htmlGroup || !cssGroup || !scriptGroup) return;

  htmlGroup.style.width = `${newHtmlWidth}px`;
  cssGroup.style.width = `${newCssWidth}px`;
  scriptGroup.style.width = `${newScriptWidth}px`;
};

const onPointerUpX = (event: PointerEvent) => {
  refs.css.handleX?.releasePointerCapture(event.pointerId);

  updateDimensions();

  window.removeEventListener("pointermove", onPointerMoveX);
  window.removeEventListener("pointerup", onPointerUpX);
  window.removeEventListener("pointercancel", onPointerUpX);
};

const onPointerMoveY = (event: PointerEvent) => {
  const dy = event.clientY - position.css.handleY.y;
  if (dy === 0) return;

  let newHtmlHeight = position.html.blockY.h + dy;
  let newCssHeight = position.css.blockY.h - dy;
  let newScriptHeight = position.script.blockY.h;

  // if css container height is less than zero remove from html container
  if (newHtmlHeight < 0) return;
  if (newCssHeight < 0) newScriptHeight -= dy;

  newCssHeight = newCssHeight || 0; // minimum zero Height.
  // should not allow to resize once all other containers are of zero Height.
  if (newScriptHeight < 0) return;

  const htmlGroup = refs.html.blockY,
    cssGroup = refs.css.blockY,
    scriptGroup = refs.script.blockY;
  if (!htmlGroup || !cssGroup || !scriptGroup) return;

  htmlGroup.style.height = `${newHtmlHeight}px`;
  cssGroup.style.height = `${newCssHeight}px`;
  scriptGroup.style.height = `${newScriptHeight}px`;
};

const onPointerUpY = (event: PointerEvent) => {
  refs.css.handleX?.releasePointerCapture(event.pointerId);
  updateDimensions();

  window.removeEventListener("pointermove", onPointerMoveY);
  window.removeEventListener("pointerup", onPointerUpY);
  window.removeEventListener("pointercancel", onPointerUpY);
};
