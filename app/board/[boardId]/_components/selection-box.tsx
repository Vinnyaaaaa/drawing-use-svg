"use client";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useCanvasState } from "@/store/canvas-state";
import { Side, XYWH } from "@/types/canvas";
import { memo } from "react";

interface Props {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;
export const SelectionBox = memo(({ onResizeHandlePointerDown }: Props) => {
  const bounds = useSelectionBounds();
  const selection = useCanvasState((state) => state.selection);

  const isShowingHandles = selection.length === 1;

  if (!bounds) {
    return;
  }

  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
        style={{
          transform: `translate(${bounds.x}px, ${bounds.y}px)`,
        }}
        x={0}
        y={0}
        height={bounds.height}
        width={bounds.width}
      />

      {isShowingHandles && (
        <>
          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                bounds.y - HANDLE_WIDTH / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
            }}
          />

          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
              }px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top, bounds);
            }}
          />

          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x + bounds.width - HANDLE_WIDTH / 2
              }px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
            }}
          />

          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Left, bounds);
            }}
          />
          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                bounds.y + bounds.height - HANDLE_WIDTH / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
            }}
          />
          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
              }px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom, bounds);
            }}
          />

          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x + bounds.width - HANDLE_WIDTH / 2
              }px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
            }}
          />

          <rect
            className="fill-white start-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x + bounds.width - HANDLE_WIDTH / 2
              }px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              onResizeHandlePointerDown(Side.Right, bounds);
            }}
          />
        </>
      )}
    </>
  );
});
