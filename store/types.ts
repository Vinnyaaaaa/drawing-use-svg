export type CanvasStates = {
  layers: Map<string, any>;
  layerIds: Array<string>;

  selection: Array<string>;
};

export type CanvasAction = {
  setLayers: (id: string, layer: any) => void;
  setLayerIds: (layerIds: string) => void;
  setSelection: (selection: string | Array<string>) => void;
  resetSelection: () => void;
  mergeLayers: (layer: Map<string, any>) => void;
};
