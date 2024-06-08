"use client";
import { FocusEventHandler, useEffect, useState } from "react";
import { useParams } from "wouter";

import { getPenDB } from "@/db";
import useDBMutation from "@/hooks/useDBMutation";

const penDB = getPenDB();

export default function PenTitle() {
  const params = useParams<{ penId: string }>();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Untitled");

  const { queryData, updateData } = useDBMutation(penDB);

  useEffect(() => {
    if (!params.penId) return;
    (async () => {
      try {
        const res = await queryData((data) => data.id === params.penId);
        if (!res.length) throw new Error("Pen Not Found");
        setTitle(res[0].title);
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.penId]);

  const startEditing = () => {
    setEditing(true);
  };

  const updatePenTitle: FocusEventHandler<HTMLInputElement> = async (event) => {
    setEditing(false);
    setTitle(event.target.value);
    try {
      await updateData(params.penId, { title: event.target.value });
    } catch (error) {
      // reset edit
      setTitle(title);
    }
  };

  if (!params.penId) return null;

  if (!editing)
    return (
      <div className="flex gap-2 items-center">
        <h3 onClick={startEditing}>{title}</h3>
        <i
          onClick={startEditing}
          className="bx bxs-pencil text-xl text-white cursor-pointer"
        ></i>
      </div>
    );

  return (
    <input
      autoFocus={true}
      className="bg-transparent p-1 outline-none outline-0 border-0"
      type="text"
      defaultValue={title}
      onBlur={updatePenTitle}
    />
  );
}
