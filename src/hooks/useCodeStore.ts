import { CodeStore } from "@/context/code-store-ctx";
import { useContext } from "react";

export default function useCodeStore() {
  return useContext(CodeStore);
}
