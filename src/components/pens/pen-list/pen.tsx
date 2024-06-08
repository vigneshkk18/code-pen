import { Link } from "wouter";

import { Pen as IPen } from "@/types/pen";

export default function Pen(pen: IPen) {
  return (
    <Link key={pen.id} href={`/pens/${pen.id}`}>
      <li className="cursor-pointer bg-[#1e1f26] p-4 rounded-md" key={pen.id}>
        <div className="flex items-center gap-2">
          <i className="bx bxl-codepen text-xl"></i>
          <p
            title={pen.title}
            className="overflow-hidden text-ellipsis text-nowrap"
          >
            {pen.title}
          </p>
        </div>
      </li>
    </Link>
  );
}
