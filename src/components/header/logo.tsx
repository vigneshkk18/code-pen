import { Link } from "wouter";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/">
        <i className="bx bxl-codepen text-5xl text-white"></i>
      </Link>
      <h1 className="text-xl tracking-widest font-bold">CodePen</h1>
    </div>
  );
}
