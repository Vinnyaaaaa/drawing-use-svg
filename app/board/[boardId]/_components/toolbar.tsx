"use client";

import {
  Type,
  Square,
  Circle,
  MousePointer2,
  StickyNote,
  Pencil,
} from "lucide-react";
import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface Props {
  canvasState: CanvasState;
  setCanvasState: (canvasState: CanvasState) => void;
}

export const ToolBar = ({ canvasState, setCanvasState }: Props) => {
  return (
    <div className="absolute left-2 top-[25%] -translate-y-[-50%] flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet
          }
          onClick={() => {
            setCanvasState({ mode: CanvasMode.None });
          }}
        />
        <ToolButton
          label="Text"
          icon={Type}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            });
          }}
        />
        <ToolButton
          label="Note"
          icon={StickyNote}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Note
          }
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            });
          }}
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            });
          }}
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            });
          }}
        />
        <ToolButton
          label="Pencil"
          icon={Pencil}
          isActive={canvasState.mode === CanvasMode.Pencil}
          onClick={() => {
            setCanvasState({ mode: CanvasMode.Pencil });
          }}
        />
      </div>
    </div>
  );
};
