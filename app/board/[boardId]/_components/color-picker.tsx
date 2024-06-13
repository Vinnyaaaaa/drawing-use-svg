import { COLORS } from "@/lib/utils";
import { useCanvasState } from "@/store/canvas-state";

interface ColorPickerProps {}

export const ColorPicker = ({}: ColorPickerProps) => {
  const selection = useCanvasState((state) => state.selection);
  const layers = useCanvasState((state) => state.layers);
  const setLayers = useCanvasState((state) => state.setLayers);

  const onClick = (fill: string) => {
    selection.forEach((layerId) => {
      const layer = layers.get(layerId);
      if (layer) {
        setLayers(layerId, { ...layer, fill });
      }
    });
  };
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      {COLORS.map((color) => {
        return <ColorButton color={color} key={color} onClick={onClick} />;
      })}
    </div>
  );
};

interface ColorButtonProps {
  color: string;
  onClick: (color: string) => void;
}

const ColorButton = ({ color, onClick }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => {
        onClick(color);
      }}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{ background: color }}
      ></div>
    </button>
  );
};
