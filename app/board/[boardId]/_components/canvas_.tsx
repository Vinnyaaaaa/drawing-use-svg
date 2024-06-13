"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Back } from "./back";
import { ToolBar } from "./toolbar";
import { Camera, Layer, LayerType, Point } from "@/store/types";
import { COLORS, drawRect, pointerEventToCanvasPoint } from "@/lib/utils";
import { useCanvasState } from "@/store/canvas-state";

interface Props {
  id: string;
}

export const Canvas = ({ id }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const [layers, setLayers] = useState<Array<Layer>>([]);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

  const { mode, layerType, switchMode } = useCanvasState((state) => ({
    mode: state.mode,
    layerType: state.layerType,
    switchMode: state.switchMode,
  }));

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({ x: camera.x - e.deltaX, y: camera.y - e.deltaY }));
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    const current = pointerEventToCanvasPoint(e, camera);
  };

  const onPointerLeave = () => {};

  const onPointerUp = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (mode === CanvasMode.Inserting) {
      insertLayer(point);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const ctx = ref.current!.getContext("2d")!;
    const point = pointerEventToCanvasPoint(e, camera);
    if (mode !== CanvasMode.Inserting) {
      const changeLayers = [];
      let preSelectLayer: Layer | null = null;

      let containerLayer = layers.find((layer) => {
        return ctx.isPointInPath(layer.path, point.x, point.y);
      });

      if (
        selectedLayer?.x === containerLayer?.x &&
        selectedLayer?.y === containerLayer?.y
      ) {
        return;
      }

      if (containerLayer) {
        containerLayer = drawRect(
          ctx,
          { x: containerLayer.x, y: containerLayer.y },
          COLORS[8],
          COLORS[8],
          true
        );

        changeLayers.push(containerLayer);

        if (selectedLayer) {
          preSelectLayer = drawRect(ctx, {
            x: selectedLayer.x,
            y: selectedLayer.y,
          });

          changeLayers.push(preSelectLayer);
        }

        const newLayers = layers.filter((layer) => {
          return (
            layer.x !== containerLayer!.x &&
            layer.y !== containerLayer!.y &&
            layer.x !== preSelectLayer?.x &&
            layer.y !== preSelectLayer?.y
          );
        });

        setLayers([...newLayers, ...changeLayers]);
        setSelectedLayer(containerLayer);
      }
    }
  };

  const insertLayer = (point: Point) => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;

    switch (layerType) {
      case LayerType.Rectangle:
        const rect = drawRect(ctx, point);

        console.log("rect", rect);
        setLayers([...layers, rect]);
        break;

      default:
        break;
    }

    switchMode(CanvasMode.None);
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    //调整Canvas的画布大小
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    canvas.style.width = canvas.clientWidth + "px";
    canvas.style.height = canvas.clientHeight + "px";
  }, []);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Back />
      <ToolBar />

      <canvas
        className="h-full w-full "
        ref={ref}
        onWheel={onWheel}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      />
    </main>
  );
};
