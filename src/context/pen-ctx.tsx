import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "wouter";

import { getPenDB } from "@/db";

import { Pen } from "@/types/pen";

interface PenCtx {
  pen: Pen | null;
  updatePen: Dispatch<SetStateAction<Pen | null>>;
}

const PenCtx = createContext<PenCtx>({ pen: null, updatePen() {} });

const penDB = getPenDB();

export default function PenWrapper({ children }: PropsWithChildren) {
  const { penId } = useParams<{ penId: string }>();
  const [pen, setPen] = useState<Pen | null>(null);

  useEffect(() => {
    if (!penId) return;
    (async () => {
      try {
        const pens = await penDB.query((data) => data.id === penId);
        if (!pens || !pens.length) throw new Error("Pen Not Found!!!");
        const pen = pens[0];
        if (pen.extensionEnabled) {
          pen.extensionEnabled.script = {
            ...pen.extensionEnabled.script,
            packages: Array.from(
              new Set(
                (pen.extensionEnabled.script?.packages || []).filter(
                  (pkg) => pkg.trim().length
                )
              )
            ),
          };
        }
        setPen(pen);
      } catch (error: any) {
        console.error(error.message);
      }
    })();
  }, [penId]);

  useEffect(() => {
    if (!pen?.html || !pen.css || !pen.script) return;
    const fn = async () => {
      try {
        await penDB.updateData(penId, pen);
      } catch (error: any) {
        console.error(error);
      }
    };
    const timer = setTimeout(fn, 2000);
    return () => clearTimeout(timer);
  }, [pen]);

  return (
    <PenCtx.Provider value={{ pen, updatePen: setPen }}>
      {children}
    </PenCtx.Provider>
  );
}

export const usePen = () => useContext(PenCtx);
