"use client";

import { LayerType } from "@/types/canvas";
import { Rectangle } from "./rectangle";
import { useCanvasState } from "@/store/canvas-state";
import { Ellipse } from "./ellipse";
import { Text } from "./text";

interface Props {
  key: string;
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
}

export const LayerPreview = ({ id, onLayerPointerDown }: Props) => {
  const layers = useCanvasState((state) => state.layers);
  const layer = layers.get(id);

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onLayerPointerDown={onLayerPointerDown}
        />
      );
    case LayerType.Text:
      return (
        <Text id={id} layer={layer} onLayerPointerDown={onLayerPointerDown} />
      );
    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onLayerPointerDown={onLayerPointerDown}
        />
      );
  }
};
