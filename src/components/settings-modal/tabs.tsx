import { useSettingsModal } from "@/context/settings-modal-ctx";
import { useSearch } from "wouter";
import { MouseEventHandler, PropsWithChildren } from "react";

export default function Tabs() {
  const { changeTab } = useSettingsModal();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);

  const activeSettings = searchParams.get("settings");

  return (
    <nav className="w-1/3">
      <ul>
        <Tab onClick={() => changeTab("css")} active={activeSettings === "css"}>
          CSS
        </Tab>
        <Tab
          onClick={() => changeTab("script")}
          active={activeSettings === "script"}
        >
          JS
        </Tab>
      </ul>
    </nav>
  );
}

interface ITab {
  active: boolean;
  onClick: MouseEventHandler<HTMLLIElement>;
}

function Tab({ children, onClick, active }: PropsWithChildren<ITab>) {
  const activeCls =
    "bg-[#2c303a] font-bold relative before:w-1 before:h-full before:absolute before:left-0 before:bg-[#47cf73] before:top-0";

  return (
    <li
      onClick={onClick}
      className={`${
        active ? activeCls : ""
      } cursor-pointer px-4 py-2 hover:bg-[#2c303a]`}
    >
      {children}
    </li>
  );
}
