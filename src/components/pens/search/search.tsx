import { ChangeEventHandler } from "react";

interface Search {
  search: string;
  onSearch: ChangeEventHandler<HTMLInputElement>;
}

export default function Search({ search, onSearch }: Search) {
  return (
    <div
      className={`w-full flex gap-2 items-center rounded-md bg-[#252830] text-[#868ca0] has-[:focus]:bg-[#444857] has-[:focus]:text-[#c7c9d3]`}
    >
      <i className={`bx bx-search text-xl h-full px-4 py-2`}></i>
      <input
        type="text"
        value={search}
        onChange={onSearch}
        className={`flex-grow peer border-0 outline-0 outline-none bg-transparent rounded-e-md placeholder:text-[#868ca0] text-white`}
        placeholder="Search CodePen..."
      />
    </div>
  );
}
