import { useMemo, type RefObject } from "react";
import type { Stage3D } from "./Stage3D";

/** Pointer handlers that turn a Stage3D object by dragging. */
export function useDrag3D(stage: RefObject<Stage3D | null>) {
  return useMemo(
    () => ({
      onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
        stage.current?.dragStart(e.clientX);
        e.currentTarget.setPointerCapture(e.pointerId);
      },
      onPointerMove: (e: React.PointerEvent<HTMLElement>) => stage.current?.dragMove(e.clientX),
      onPointerUp: () => stage.current?.dragEnd(),
      onPointerCancel: () => stage.current?.dragEnd(),
    }),
    [stage],
  );
}
