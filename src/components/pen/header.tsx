import Button from "@/components/ui/button";

import useCodeResize from "@/hooks/useCodeResize";
import { useSettingsModal } from "@/context/settings-modal-ctx";

import { Language, isCodeTop, languageLabels } from "@/utils/layout";
import { languageIconCls, languageToResizeNames } from "@/utils/resize/common";
import { usePen } from "@/context/pen-ctx";

interface Header {
  language: Language;
}

export default function Header({ language }: Header) {
  const { pen } = usePen();
  const { openModal } = useSettingsModal();
  const { resizeFnMap, layout } = useCodeResize();

  const preprocessor =
    pen?.extensionEnabled?.[language]?.preprocessor || "none";

  return (
    <header className={`bg-[#060606] overflow-hidden flex justify-between`}>
      <div
        className={`flex-grow ${
          isCodeTop(layout) ? "" : "cursor-all-scroll"
        } ${language}-handleY`}
        onPointerDown={
          isCodeTop(layout)
            ? undefined
            : resizeFnMap[languageToResizeNames[language]]
        }
      >
        <div className="bg-[#1d1e22] border-t-2 border-t-[#34363e] w-max p-2 px-4 flex gap-2 items-center flex-wrap">
          <i
            className={`${languageIconCls(preprocessor)[language]} text-2xl`}
          ></i>
          <span className="text-[#aaaebc] overflow-hidden text-ellipsis">
            {languageLabels[language]}
          </span>
        </div>
      </div>
      <div className="flex items-center pr-2">
        {/* <FullScreen language={language} /> */}
        {(language === "css" || language === "script") && (
          <Button onClick={openModal(language)} className="!px-2 !py-1">
            <i className="bx bxs-cog text-white"></i>
          </Button>
        )}
      </div>
    </header>
  );
}
