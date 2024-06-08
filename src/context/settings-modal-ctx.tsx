"use client";

import {
  MouseEventHandler,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";
import { useLocation } from "wouter";

import SettingsModalEl from "@/components/settings-modal/settings-modal";

type tab = "css" | "script";

interface SettingsModalCtx {
  openModal: (tab?: tab) => MouseEventHandler<HTMLButtonElement>;
  closeModal: () => void;
  changeTab: (tab: tab) => void;
}

const SettingsModalCtx = createContext<SettingsModalCtx>({
  openModal() {
    return function () {};
  },
  closeModal() {},
  changeTab() {},
});

export default function SettingsModal({ children }: PropsWithChildren) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [pathname, redirect] = useLocation();

  const changeTab = (tab: tab) => {
    const searchParams = new URLSearchParams({ settings: tab });
    redirect(pathname + "?" + searchParams.toString());
  };

  const openModal = (tab: tab = "css") =>
    ((event) => {
      event.stopPropagation();
      event.preventDefault();

      if (!modalRef.current) return;
      changeTab(tab);
      modalRef.current.showModal();
    }) as MouseEventHandler<HTMLButtonElement>;

  const closeModal = () => {
    if (!modalRef.current) return;
    modalRef.current.close();
  };

  return (
    <SettingsModalCtx.Provider value={{ openModal, closeModal, changeTab }}>
      {children}
      <SettingsModalEl ref={modalRef} />
    </SettingsModalCtx.Provider>
  );
}

export const useSettingsModal = () => useContext(SettingsModalCtx);
