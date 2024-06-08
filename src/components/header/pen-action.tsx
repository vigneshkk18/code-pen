import { useParams } from "wouter";

import NewPen from "./new-pen";
import PenActionEdit from "./pen-action-edit";

export default function PenAction() {
  const params = useParams<{ penId?: string }>();

  if (!params.penId) return <NewPen />;

  return <PenActionEdit />;
}
