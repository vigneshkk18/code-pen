"use client";
import {
  ChangeEventHandler,
  useDeferredValue,
  useEffect,
  useState,
} from "react";

import Search from "@/components/pens/search/search";
import PenList from "@/components/pens/pen-list/pen-list";
import useLocalStorageSync from "@/hooks/useLocalStorageSync";
import { Header } from "@/components/header/header";

export default function Pens() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDeferredValue(search);
  useLocalStorageSync(debouncedSearch, "search");

  useEffect(() => {
    // FIXME: there is a second delay on when it actually sets this state.
    setSearch(JSON.parse(localStorage.getItem("search") || "null") || "");
  }, []);

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) =>
    setSearch(e.target.value);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl p-4 flex flex-col gap-4">
        <Search search={search} onSearch={onSearch} />
        <PenList search={debouncedSearch} />
      </main>
    </>
  );
}
