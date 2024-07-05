import type { EditorKit } from "../../editor/";
import { EDITOR_STATE } from "../../state/types";
import type { EventBus } from "../bus";
import { NATIVE_EVENTS } from "../types/native";

export class NativeEvent {
  constructor(private editor: EditorKit, private bus: EventBus) {
    document.addEventListener(NATIVE_EVENTS.GLOBAL_MOUSE_DOWN, this.onMouseDown);
    document.addEventListener(NATIVE_EVENTS.GLOBAL_MOUSE_UP, this.onMouseUp);
  }

  destroy() {
    document.removeEventListener(NATIVE_EVENTS.GLOBAL_MOUSE_UP, this.onMouseUp);
    document.removeEventListener(NATIVE_EVENTS.GLOBAL_MOUSE_DOWN, this.onMouseDown);
  }

  private onMouseDown = (e: MouseEvent) => {
    this.editor.state.set(EDITOR_STATE.IS_MOUSE_DOWN, true);
    this.bus.trigger(NATIVE_EVENTS.GLOBAL_MOUSE_DOWN, e);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.editor.state.set(EDITOR_STATE.IS_MOUSE_DOWN, false);
    this.bus.trigger(NATIVE_EVENTS.GLOBAL_MOUSE_UP, e);
  };
}
