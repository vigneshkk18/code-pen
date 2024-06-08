import { PointerEvent as ReactPointerEvent } from "react";

import { refs, position } from "@/context/code-resize-ctx";

import { Layout, isCodeTop } from "@/utils/layout";
import { capturePointerDownPosition, updateDimensions } from "@/utils/resize/common";

export const getSizeBasedOnLayout = (layout: Layout) => {
  if (isCodeTop(layout)) return (window.innerWidth - 18 * 2) / 3;

  // 68 - header, 50 - code block header, 2 - border
  return (window.innerHeight - 68 - 50 * 3 - 2 * 3) / 3;
};

export const onScriptPointerDown = (
  event: ReactPointerEvent<HTMLElement>,
  layout: Layout
) => {
  capturePointerDownPosition(event as unknown as PointerEvent, "script");
  if (isCodeTop(layout)) onScriptPointerDownX(event as unknown as PointerEvent);
  else onScriptPointerDownY(event as unknown as PointerEvent);
};

const onScriptPointerDownX = (_: PointerEvent) => {};

const onScriptPointerDownY = (event: PointerEvent) => {
  refs.script.handleX?.setPointerCapture(event.pointerId);

  window.addEventListener("pointermove", onPointerMoveY);
  window.addEventListener("pointerup", onPointerUpY);
  window.addEventListener("pointercancel", onPointerUpY);
};

const onPointerMoveY = (event: PointerEvent) => {
  const dy = event.clientY - position.script.handleY.y;
  if (dy === 0) return;

  let newHtmlHeight = position.html.blockY.h;
  let newCssHeight = position.css.blockY.h + dy;
  let newScriptHeight = position.script.blockY.h - dy;

  const htmlGroup = refs.html.blockY,
    cssGroup = refs.css.blockY,
    scriptGroup = refs.script.blockY;
  if (!htmlGroup || !cssGroup || !scriptGroup) return;

  // if script container height is less than zero remove from html container
  if (newCssHeight < 0) newHtmlHeight = newHtmlHeight + dy;

  newCssHeight = newCssHeight || 0; // minimum zero Height.
  // should not allow to resize once all other containers are of zero Height.
  if (newHtmlHeight < 0 || newScriptHeight < 0) return;

  htmlGroup.style.height = `${newHtmlHeight}px`;
  cssGroup.style.height = `${newCssHeight}px`;
  scriptGroup.style.height = `${newScriptHeight}px`;
};

const onPointerUpY = (event: PointerEvent) => {
  refs.script.handleX?.setPointerCapture(event.pointerId);

  updateDimensions();

  window.removeEventListener("pointermove", onPointerMoveY);
  window.removeEventListener("pointerup", onPointerUpY);
  window.removeEventListener("pointercancel", onPointerUpY);
};
