"use client";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useCanvasState } from "@/store/canvas-state";
import { Camera } from "@/types/canvas";
import { ColorPicker } from "./color-picker";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  camera: Camera;
}

export const SelectionTools = ({ camera }: Props) => {
  const selection = useCanvasState((state) => state.selection);

  const selectionBounds = useSelectionBounds();

  if (!selectionBounds) {
    return;
  }

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%)`,
      }}
    >
      <ColorPicker />
      <div className="flex items-center">
        <Hint label="Delete">
          <Button variant="board" size="icon" onClick={() => {}}>
            <Trash2 />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
