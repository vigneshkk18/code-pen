import useCodeResize from "@/hooks/useCodeResize";

import { isCodeTop } from "@/utils/layout";

export default function Console() {
  const { layout, resizeFnMap } = useCodeResize();

  return (
    <div
      className={`absolute flex ${
        isCodeTop(layout) ? "right-0 h-full" : "bottom-0 w-full"
      }`}
    >
      <div
        onPointerDown={resizeFnMap.onConsoleResize}
        className={`console-handleX cursor-all-scroll ${
          isCodeTop(layout) ? "w-[18px] h-full" : "w-0 h-0"
        }`}
      ></div>
      <div
        className={`flex flex-col border border-[#34363e] select-none console-blockX`}
      >
        <header
          onPointerDown={resizeFnMap.onConsoleResize}
          className={`bg-[#060606] cursor-all-scroll overflow-hidden console-handleY`}
        >
          <div className="bg-[#1d1e22] border-t-2 border-t-[#34363e] w-max p-2 px-4 flex gap-2 items-center flex-wrap">
            <i className="bx bxl-slack-old text-[#666666] text-2xl"></i>
            <span className="text-[#aaaebc] overflow-hidden text-ellipsis">
              Console
            </span>
          </div>
        </header>
        <div className="console-blockY w-full h-full bg-[#282c34]"></div>
      </div>
    </div>
  );
}
