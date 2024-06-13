import { LayerType } from "@/types/canvas";
export class LayerObj {
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;

  constructor(
    type: LayerType,
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill;
  }
}
