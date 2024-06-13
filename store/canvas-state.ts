import { create } from "zustand";
import { CanvasAction, CanvasStates } from "./types";

const initialState = (): CanvasStates => {
  return {
    layers: new Map(),
    layerIds: [],
    selection: [],
  };
};

export const useCanvasState = create<CanvasStates & CanvasAction>()(
  (set, get) => ({
    ...initialState(),

    setLayers: (id, layers) => {
      set({ layers: get().layers.set(id, layers) });
    },

    setLayerIds: (layerIds) => {
      set({ layerIds: [...get().layerIds, layerIds] });
    },

    setSelection: (id) => {
      set({
        selection: typeof id === "string" ? [id] : [...get().selection, ...id],
      });
    },

    resetSelection: () => {
      set({ selection: [] });
    },

    mergeLayers: (layers) => {
      set({ layers: new Map([...get().layers, ...layers]) });
    },
  })
);
