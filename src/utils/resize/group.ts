import { PointerEvent as ReactPointerEvent } from "react";
import { refs, position } from "@/context/code-resize-ctx";

import { Layout, isCodeLeft, isCodeTop } from "@/utils/layout";
import {
  capturePointerDownPosition,
  updateDimensions,
} from "@/utils/resize/common";

export const getSizeBasedOnLayout = (layout: Layout) => {
  if (isCodeTop(layout)) return 300;

  return 300;
};

let layout: Layout | null = null;
export const onGroupPointerDown = (
  event: ReactPointerEvent<HTMLElement>,
  codeLayout: Layout
) => {
  capturePointerDownPosition(event as unknown as PointerEvent, "group");
  layout = codeLayout;

  if (isCodeTop(layout)) onGroupPointerDownY(event as unknown as PointerEvent);
  else onGroupPointerDownX(event as unknown as PointerEvent);
};

const onGroupPointerDownX = (event: PointerEvent) => {
  refs.group.handleX?.setPointerCapture(event.pointerId);

  document.addEventListener("pointermove", onPointerMoveX);
  document.addEventListener("pointerup", onPointerUpX);
  document.addEventListener("pointercancel", onPointerUpX);
};

const onGroupPointerDownY = (event: PointerEvent) => {
  refs.group.handleY?.setPointerCapture(event.pointerId);

  document.addEventListener("pointermove", onPointerMoveY);
  document.addEventListener("pointerup", onPointerUpY);
  document.addEventListener("pointercancel", onPointerUpY);
};

const onPointerMoveX = (event: PointerEvent) => {
  const dx = event.clientX - position.group.handleX.x;
  if (dx === 0) return;

  let newGroupWidth =
    position.group.blockX.w + (layout && isCodeLeft(layout) ? dx : -dx);

  const lowerBound = 55;
  const upperBound = window.innerWidth - 18 - 55;
  // if group container width is less than 30px remove from html container
  if (newGroupWidth < lowerBound || newGroupWidth > upperBound) return;

  const groupEl = refs.group.blockX;
  if (!groupEl) return;

  groupEl.style.width = `${newGroupWidth}px`;
};

const onPointerUpX = (event: PointerEvent) => {
  refs.group.handleX?.releasePointerCapture(event.pointerId);

  updateDimensions();
  document.removeEventListener("pointermove", onPointerMoveX);
  document.removeEventListener("pointerup", onPointerUpX);
  document.removeEventListener("pointercancel", onPointerUpX);
};

const onPointerMoveY = (event: PointerEvent) => {
  const dy = event.clientY - position.group.handleY.y;
  if (dy === 0) return;

  let newGroupHeight = position.group.blockY.h + dy;

  const lowerBound = 55;
  const upperBound = window.innerHeight - 18 - 55 - 68 - 150;

  // if group container width is less than 30px remove from html container
  if (newGroupHeight < lowerBound || newGroupHeight > upperBound) return;

  const groupEl = refs.group.blockY;
  if (!groupEl) return;

  groupEl.style.height = `${newGroupHeight}px`;
};

const onPointerUpY = (event: PointerEvent) => {
  refs.group.handleY?.releasePointerCapture(event.pointerId);

  updateDimensions();

  document.removeEventListener("pointermove", onPointerMoveY);
  document.removeEventListener("pointerup", onPointerUpY);
  document.removeEventListener("pointercancel", onPointerUpY);
};
