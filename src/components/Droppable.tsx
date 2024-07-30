"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  children: React.ReactNode;
  id: string;
};

export function Droppable(props: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  const style = {
    opacity: isOver ? 1 : 0.5,
    border: isOver ? '2px dashed green' : '2px dashed transparent', // Visual feedback for droppable area
  };

  return (
    <div ref={setNodeRef} style={style} >
      {props.children}
    </div>
  );
}
