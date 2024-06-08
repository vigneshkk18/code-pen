import { refs, position } from "@/context/code-resize-ctx";
import { Layout, LayoutObj } from "../layout";
import { PointerEvent as ReactPointerEvent } from "react";
import { capturePointerDownPosition, updateDimensions } from "./common";

export const getSizeBasedOnLayout = () => {
  return 300;
};

export const onConsolePointerDown = (
  event: ReactPointerEvent<HTMLElement>,
  layout: Layout
) => {
  capturePointerDownPosition(event as unknown as PointerEvent, "console");

  if (isCodeTop(layout))
    onConsolePointerDownX(event as unknown as PointerEvent);
  else onConsolePointerDownY(event as unknown as PointerEvent);
};

const onConsolePointerDownX = (event: PointerEvent) => {
  refs.console.handleX?.setPointerCapture(event.pointerId);

  window.addEventListener("pointermove", onPointerMoveX);
  window.addEventListener("pointerup", onPointerUpX);
  window.addEventListener("pointercancel", onPointerUpX);
};

const onConsolePointerDownY = (event: PointerEvent) => {
  refs.console.handleY?.setPointerCapture(event.pointerId);

  window.addEventListener("pointermove", onPointerMoveY);
  window.addEventListener("pointerup", onPointerUpY);
  window.addEventListener("pointercancel", onPointerUpY);
};

const onPointerMoveX = (event: PointerEvent) => {
  const dx = event.clientX - position.console.handleX.x;

  let newConsoleWidth = position.console.blockX.w - dx;

  if (newConsoleWidth < 55 || newConsoleWidth > window.innerWidth - 200) return;

  const consoleGroup = refs.console.blockX;
  if (!consoleGroup) return;

  consoleGroup.style.width = `${newConsoleWidth}px`;
};

const onPointerUpX = (event: PointerEvent) => {
  refs.console.handleX?.releasePointerCapture(event.pointerId);

  updateDimensions();

  window.removeEventListener("pointermove", onPointerMoveX);
  window.removeEventListener("pointerup", onPointerUpX);
  window.removeEventListener("pointercancel", onPointerUpX);
};

const onPointerMoveY = (event: PointerEvent) => {
  const dy = event.clientY - position.console.handleY.y;

  let newConsoleHeight = position.console.blockY.h - dy;
  if (newConsoleHeight < 0 || newConsoleHeight > window.innerHeight - 68 - 150)
    return;

  const consoleGroup = refs.console.blockY;
  if (!consoleGroup) return;

  consoleGroup.style.height = `${newConsoleHeight}px`;
};

const onPointerUpY = (event: PointerEvent) => {
  refs.console.handleY?.releasePointerCapture(event.pointerId);

  updateDimensions();

  window.removeEventListener("pointermove", onPointerMoveY);
  window.removeEventListener("pointerup", onPointerUpY);
  window.removeEventListener("pointercancel", onPointerUpY);
};
