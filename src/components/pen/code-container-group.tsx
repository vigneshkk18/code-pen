import CodeContainer from "@/components/pen/code-container";
import CodeContainerResize from "@/components/pen/code-container-resizer";

import useCodeResize from "@/hooks/useCodeResize";

import { isCodeRight, isCodeTop } from "@/utils/layout";

export default function CodeContainerGroup() {
  const { layout } = useCodeResize();

  let direction = "";
  if (isCodeTop(layout)) direction = "flex-col";
  if (isCodeRight(layout)) direction = "flex-row-reverse";

  return (
    <div className={`flex ${direction}`}>
      <div
        className={`flex ${
          isCodeTop(layout) ? "h-[300px] w-full" : "w-[300px] flex-col"
        } group-blockX group-blockY`}
      >
        <CodeContainer language="html" />
        <CodeContainer language="css" />
        <CodeContainer language="script" canResizeX={false} />
      </div>
      <CodeContainerResize />
    </div>
  );
}
