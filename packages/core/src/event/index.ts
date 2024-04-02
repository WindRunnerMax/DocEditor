import type { EditorSuite } from "../editor/types";
import { EventBus } from "./modules";

export class Event {
  private bus: EventBus;

  constructor(private editor: EditorSuite) {
    this.bus = new EventBus();
  }

  on: EventBus["on"] = (key, listener, priority) => {
    return this.bus.on(key, listener, priority);
  };

  once: EventBus["once"] = (key, listener, priority) => {
    return this.bus.once(key, listener, priority);
  };

  off: EventBus["off"] = (key, listener) => {
    return this.bus.off(key, listener);
  };

  trigger: EventBus["trigger"] = (key, payload) => {
    return this.bus.trigger(key, payload);
  };

  destroy = () => {
    this.bus.clear();
  };
}
