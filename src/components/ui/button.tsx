import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface IButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "success";
}

export default function Button({
  className = "",
  variant = "primary",
  children,
  ...props
}: IButton) {
  const color =
    variant === "primary"
      ? "bg-btnPrimary hover:bg-btnPrimaryHover text-primary"
      : "bg-btnSuccess hover:bg-btnSecondaryHover text-secondary hover:text-white";

  return (
    <button
      className={`${className} border-0 outline-0 outline-none flex items-center gap-2 px-4 py-2 rounded-md ${color}`}
      {...props}
    >
      {children}
    </button>
  );
}
