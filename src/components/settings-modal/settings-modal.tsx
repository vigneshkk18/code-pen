import { forwardRef } from "react";

import Header from "@/components/settings-modal/header";
import Actions from "@/components/settings-modal/actions";
import Content from "@/components/settings-modal/content";

function SettingsModal(_: any, ref: any) {
  return (
    <dialog
      className="bg-[#131417] text-white w-full max-w-lg rounded-md shadow-2xl backdrop:bg-black/50"
      ref={ref}
    >
      <Header />
      <Content />
      <Actions />
    </dialog>
  );
}

export default forwardRef(SettingsModal);
