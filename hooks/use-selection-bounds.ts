import { useCanvasState } from "@/store/canvas-state";
import { Layer, XYWH } from "@/types/canvas";

const boundingBox = (layer: Layer[]): XYWH | null => {
  const first = layer[0];

  if (!first) return null;
  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  for (let i = 1; i < layer.length; i++) {
    const { x, y, width, height } = layer[i];

    if (left > x) {
      left = x;
    }
    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }

    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

export const useSelectionBounds = () => {
  const selection = useCanvasState((state) => state.selection);
  const layers = useCanvasState((state) => state.layers);

  const selectedLayer = selection.map((layerId) => {
    return layers.get(layerId);
  });

  return boundingBox(selectedLayer);
};
