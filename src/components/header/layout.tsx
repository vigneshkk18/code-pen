import { useState, useRef, useEffect } from "react";

import Button from "@/components/ui/button";
import LayoutIcon from "@/components/ui/layout-icon";
import LayoutMenu from "@/components/header/layout-menu";

import {
  LayoutObj,
  Layout as ILayout,
  isCodeTop,
  isCodeRight,
} from "@/utils/layout";

export default function Layout() {
  const [showMenu, setShowMenu] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<ILayout>(
    LayoutObj.CODE_LEFT_OUTPUT_RIGHT
  );

  useEffect(() => {
    setLayout(
      JSON.parse(localStorage.getItem("layout") || "null") ||
        LayoutObj.CODE_LEFT_OUTPUT_RIGHT
    );
  }, []);

  const toggleLayoutMenu = () => {
    setShowMenu(!showMenu);
  };

  const selectLayout = (layout: ILayout) => () => {
    setShowMenu(false);
    setLayout(layout);

    const bc = new BroadcastChannel("layout-change");
    bc.postMessage(layout);
  };

  let rotateCls = "";
  if (isCodeTop(layout)) rotateCls = "rotate-90";
  if (isCodeRight(layout)) rotateCls = "rotate-180";

  return (
    <div className="relative">
      <Button className="h-full" onClick={toggleLayoutMenu}>
        <LayoutIcon
          fill="#ffffff"
          width={24}
          className={`${rotateCls} transition-[transform]`}
        />
      </Button>
      <LayoutMenu ref={menu} showMenu={showMenu} selectLayout={selectLayout} />
    </div>
  );
}
