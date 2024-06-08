import { PointerEvent as ReactPointerEvent } from "react";
import { refs, position } from "@/context/code-resize-ctx";

import {
  capturePointerDownPosition,
  updateDimensions,
} from "@/utils/resize/common";
import { Layout, isCodeTop, isCodeLeft, isCodeRight } from "@/utils/layout";

export const getSizeBasedOnLayout = (layout: Layout) => {
  if (isCodeTop(layout)) return (window.innerWidth - 18 * 2) / 3;

  // 68 - header, 50 - code block header, 2 - border
  return (window.innerHeight - 68 - 50 * 3 - 2 * 3) / 3;
};

export const onHTMLPointerDown = (
  event: ReactPointerEvent<HTMLElement>,
  layout: Layout
) => {
  // doesn't need resize
  if (isCodeLeft(layout) || isCodeRight(layout)) return;

  refs.html.handleX?.setPointerCapture(event.pointerId);

  capturePointerDownPosition(event as unknown as PointerEvent, "html");

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
};

const onPointerMove = (event: PointerEvent) => {
  const dx = event.clientX - position.html.handleX.x;

  const newHTMLWidth = position.html.blockX.w + dx;
  let newCssWidth = position.css.blockX.w - dx;
  let newScriptWidth = position.script.blockX.w;

  // if css container width is less than zero remove from script container
  if (newCssWidth < 0) newScriptWidth -= dx;

  newCssWidth = newCssWidth || 0; // minimum zero width.

  // should not allow to resize once all other containers are of zero width.
  if (newScriptWidth < 0) return;
  newScriptWidth = newScriptWidth || 0;

  const htmlGroup = refs.html.blockX,
    cssGroup = refs.css.blockX,
    scriptGroup = refs.script.blockX;
  if (!htmlGroup || !cssGroup || !scriptGroup) return;

  htmlGroup.style.width = `${newHTMLWidth}px`;
  cssGroup.style.width = `${newCssWidth}px`;
  scriptGroup.style.width = `${newScriptWidth}px`;
};

const onPointerUp = (event: PointerEvent) => {
  refs.html.handleX?.releasePointerCapture(event.pointerId);

  updateDimensions();

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);
};
