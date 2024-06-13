"use client";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { CanvasMode } from "@/store/types";
import { useCanvasState } from "@/store/canvas-state";
interface Props {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;

  onClick: () => void;
}

export const ToolButton = ({ label, icon: Icon, onClick, isActive }: Props) => {
  const switchMode = useCanvasState((state) => state.switchMode);

  return (
    <Hint label={label} side="right" sideOffset={14}>
      <Button
        onClick={onClick}
        size="icon"
        variant={isActive ? "boardActive" : "board"}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
