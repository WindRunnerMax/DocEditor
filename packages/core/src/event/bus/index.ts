import { DEFAULT_PRIORITY } from "doc-editor-utils";

import type { EventMap, EventType, Handler, Listener, Listeners, WithStop } from "./action";

export class EventBus {
  private listeners: Listeners = {};

  public on<T extends EventType>(key: T, listener: Listener<T>, priority = DEFAULT_PRIORITY) {
    this.addEventListener(key, listener, priority, false);
  }

  public once<T extends EventType>(key: T, listener: Listener<T>, priority = DEFAULT_PRIORITY) {
    this.addEventListener(key, listener, priority, true);
  }

  private addEventListener<T extends EventType>(
    key: T,
    listener: Listener<T>,
    priority: number,
    once: boolean
  ) {
    const handler: Handler<T>[] = this.listeners[key] || [];
    !handler.some(item => item.listener === listener) && handler.push({ listener, priority, once });
    handler.sort((a, b) => a.priority - b.priority);
    (this.listeners[key] as Handler<T>[]) = handler;
  }

  public off<T extends EventType>(key: T, listener: Listener<T>) {
    const handler = this.listeners[key];
    if (!handler) return void 0;
    // COMPAT: 不能直接`splice` 可能会导致`trigger`时打断`forEach`
    const next = handler.filter(item => item.listener !== listener);
    (this.listeners[key] as Handler<T>[]) = next;
  }

  public trigger<T extends EventType>(key: T, payload: EventMap[T]) {
    const handler = this.listeners[key];
    if (!handler) return void 0;
    let stop = false;
    const duplicate = {
      ...payload,
      stop: () => (stop = true),
    } as WithStop<EventMap[T]>;
    for (const item of handler) {
      item.listener(duplicate);
      item.once && this.off(key, item.listener);
      if (stop) break;
    }
  }

  public clear() {
    this.listeners = {};
  }
}
