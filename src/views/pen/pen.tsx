import CodeOutputGroup from "@/components/pen/code-output-container";
import CodeContainerGroup from "@/components/pen/code-container-group";

import PenWrapper from "@/context/pen-ctx";
import CodeStoreCtx from "@/context/code-store-ctx";
import CodeResizeCtx from "@/context/code-resize-ctx";
import SettingsModal from "@/context/settings-modal-ctx";

import useCodeResize from "@/hooks/useCodeResize";

import { isCodeRight, isCodeTop } from "@/utils/layout";
import { Header } from "@/components/header/header";

function Component() {
  const { layout } = useCodeResize();

  let gridPosition = "";
  if (isCodeTop(layout)) gridPosition = "flex-col";
  if (isCodeRight(layout)) gridPosition = "flex-row-reverse";

  return (
    <CodeStoreCtx>
      <SettingsModal>
        <main
          className={`w-screen h-[calc(100vh-69px)] select-none flex ${gridPosition}`}
        >
          <CodeContainerGroup />
          <CodeOutputGroup />
        </main>
      </SettingsModal>
    </CodeStoreCtx>
  );
}

export default function Pen() {
  return (
    <>
      <Header />
      <CodeResizeCtx>
        <PenWrapper>
          <Component />
        </PenWrapper>
      </CodeResizeCtx>
    </>
  );
}
