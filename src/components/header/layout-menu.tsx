import { forwardRef } from "react";

import Button from "@/components/ui/button";
import LayoutIcon from "@/components/ui/layout-icon";

import { Layout, LayoutObj } from "@/utils/layout";

interface LayoutMenu {
  showMenu: boolean;
  selectLayout: (layout: Layout) => () => void;
}

function LayoutMenu({ showMenu, selectLayout }: LayoutMenu, ref: any) {
  return (
    <div
      ref={ref}
      className={`p-4 bg-[#1e1f26] text-white absolute top-[55px] rounded right-0 z-10 ${
        showMenu ? "block" : "hidden"
      }`}
    >
      <p>Change View</p>
      <div className="mt-2 flex gap-4 p-[2px]">
        <Button
          onClick={selectLayout(LayoutObj.CODE_LEFT_OUTPUT_RIGHT)}
          className="!rounded"
        >
          <LayoutIcon fill="#ffffff" width={20} />
        </Button>
        <Button
          onClick={selectLayout(LayoutObj.CODE_TOP_OUTPUT_BOTTOM)}
          className="!rounded"
        >
          <LayoutIcon fill="#ffffff" width={20} className="rotate-90" />
        </Button>
        <Button
          onClick={selectLayout(LayoutObj.CODE_RIGHT_OUTPUT_LEFT)}
          className="!rounded"
        >
          <LayoutIcon fill="#ffffff" width={20} className="rotate-180" />
        </Button>
      </div>
    </div>
  );
}

export default forwardRef(LayoutMenu);
