import { useCanvasState } from "@/store/canvas-state";
import { RectangleLayer } from "@/types/canvas";

interface Props {
  id: string;
  layer: RectangleLayer;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({ id, layer, onLayerPointerDown }: Props) => {
  const { x, y, width, height, fill } = layer;
  const selection = useCanvasState((state) => state.selection);

  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => onLayerPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={fill}
      stroke={selection.includes(id) ? "#8B5CF6" : "transparent"}
    />
  );
};
