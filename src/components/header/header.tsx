import { PropsWithChildren } from "react";

import Logo from "./logo";
import PenTitle from "./pen-title";
import PenAction from "./pen-action";

export function Header() {
  return (
    <header className="flex justify-between items-center p-2 px-4 border-b border-[#34363e]">
      <Logo />
      <PenTitle />
      <PenAction />
    </header>
  );
}

export default function WithHeader({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
