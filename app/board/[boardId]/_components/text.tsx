import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { TextLayer } from "@/types/canvas";
import { cn } from "@/lib/utils";
import { useCanvasState } from "@/store/canvas-state";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface TextProps {
  id: string;
  layer: TextLayer;
  onLayerPointerDown: (e: React.PointerEvent, id: string) => void;
}

export const Text = ({ layer, onLayerPointerDown, id }: TextProps) => {
  const { x, y, width, height, fill, value } = layer;

  const layers = useCanvasState((state) => state.layers);
  const setLayers = useCanvasState((state) => state.setLayers);
  //   const selectionColor = useCanvasState((state) => state.selectionColor);

  const updateValue = (newValue: string) => {
    setLayers(id, { ...layers.get(id), value: newValue });
  };

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onLayerPointerDown(e, id)}
      style={{
        outline: "none",
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? fill : "#000",
        }}
      />
    </foreignObject>
  );
};
