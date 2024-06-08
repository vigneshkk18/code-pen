import useCodeResize from "@/hooks/useCodeResize";

import { isCodeTop } from "@/utils/layout";

export default function CodeContainerResize() {
  const { resizeFnMap, layout } = useCodeResize();

  const dimensionCls = isCodeTop(layout)
    ? "h-[18px] w-full"
    : "h-full w-[18px]";

  return (
    <div
      onPointerDown={resizeFnMap.onGroupResize}
      className={`${dimensionCls} bg-black border-l border-l-[#34363e] cursor-all-scroll group-handleX group-handleY`}
    ></div>
  );
}
