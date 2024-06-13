"use client";
import { useCallback, useState } from "react";
import { Back } from "./back";
import { ToolBar } from "./toolbar";
import {
  CanvasState,
  Camera,
  CanvasMode,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import {
  findIntersectingLayersWithRectangle,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import { nanoid } from "nanoid";
import { LayerPreview } from "./layer-preview";
import { useCanvasState } from "@/store/canvas-state";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";

interface Props {
  id: string;
}

export const Canvas = ({ id }: Props) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const {
    layers,
    selection,
    layerIds,
    setLayers,
    setLayerIds,
    setSelection,
    resetSelection,
    mergeLayers,
  } = useCanvasState((state) => state);

  //更改选中的大小
  const onResizeHandlePointerDown = (corner: Side, initialBounds: XYWH) => {
    setCanvasState({ mode: CanvasMode.Resizing, corner, initialBounds });
  };

  //取消选中
  const unSelectLayers = () => {
    if (selection.length > 0) {
      resetSelection();
    }
  };

  //多选
  const startMultiSelection = (current: Point, origin: Point) => {
    //鼠标移动的位置超过5个像素就开始多选
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  };

  //更新选中位置
  const updateSelectionNet = (current: Point, origin: Point) => {
    setCanvasState({
      mode: CanvasMode.SelectionNet,
      origin,
      current,
    });

    //找到拖动选区内的图形
    const ids = findIntersectingLayersWithRectangle(
      layerIds,
      layers,
      origin,
      current
    );

    setSelection(ids);
  };

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({ x: camera.x - e.deltaX, y: camera.y - e.deltaY }));
  }, []);

  //鼠标移动
  const onPointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelectionNet(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    }
    setCursor(current);
  };

  const onPointerLeave = () => {
    setCursor({ x: 0, y: 0 });
  };

  //鼠标按下
  const onPointerDown = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);
    if (canvasState.mode === CanvasMode.Inserting) {
      return;
    }

    setCanvasState({ mode: CanvasMode.Pressing, origin: point });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);
    if (
      canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing
    ) {
      unSelectLayers();
      setCanvasState({ mode: CanvasMode.None });
    } else if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    } else {
      setCanvasState({ mode: CanvasMode.None });
    }
  };

  const insertLayer = (
    layerType:
      | LayerType.Ellipse
      | LayerType.Rectangle
      | LayerType.Text
      | LayerType.Note,
    position: Point
  ) => {
    const layer = {
      type: layerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      fill: "#fff",
    };
    const layerId = nanoid();
    setLayers(layerId, layer);
    setLayerIds(layerId);
    setSelection(layerId);

    setCanvasState({ mode: CanvasMode.None });
  };

  //移动选中的元素
  const translateSelectedLayer = (point: Point) => {
    if (canvasState.mode !== CanvasMode.Translating) {
      return;
    }

    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
    };

    let layerMap = new Map();

    for (const id of selection) {
      let layer = layers.get(id);
      if (layer) {
        layer = {
          ...layer,
          x: layer.x + offset.x,
          y: layer.y + offset.y,
        };
        layerMap.set(id, layer);
      }
    }

    mergeLayers(layerMap);
    setCanvasState({ mode: CanvasMode.Translating, current: point });
  };

  const resizeSelectedLayer = (point: Point) => {
    if (canvasState.mode !== CanvasMode.Resizing) {
      return;
    }

    const bounds = resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point
    );

    let selectedLayer = layers.get(selection[0]);

    selectedLayer = {
      ...selectedLayer,
      width: bounds.width,
      height: bounds.height,
      //   x: Math.min(selectedLayer.x, bounds.x),
      //   y: Math.min(selectedLayer.y, bounds.y),
    };

    setLayers(selection[0], selectedLayer);
  };

  const onLayerPointerDown = (e: React.PointerEvent, layerId: string) => {
    if (
      canvasState.mode === CanvasMode.Inserting ||
      canvasState.mode === CanvasMode.Pencil
    ) {
      return;
    }

    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);
    if (!selection.includes(layerId)) {
      setSelection(layerId);
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point });
  };

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Back />

      <ToolBar canvasState={canvasState} setCanvasState={setCanvasState} />
      <SelectionTools camera={camera} />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}></g>
        <g>
          {/* <CursorPresence />  同房间的用户鼠标位置*/}

          {layerIds.map((layerId) => {
            return (
              <LayerPreview
                key={layerId}
                id={layerId}
                onLayerPointerDown={onLayerPointerDown}
              />
            );
          })}

          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 start-1"
                x={Math.min(canvasState.current!.x, canvasState.origin.x)}
                y={Math.min(canvasState.current!.y, canvasState.origin.y)}
                width={Math.abs(canvasState.current!.x - canvasState.origin.x)}
                height={Math.abs(canvasState.current!.y - canvasState.origin.y)}
              />
            )}
        </g>
      </svg>
    </main>
  );
};
