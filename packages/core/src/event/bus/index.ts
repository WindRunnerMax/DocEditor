import { DEFAULT_PRIORITY } from "doc-editor-utils";

import type { EventContext, EventMap, EventType, Handler, Listener, Listeners } from "./action";

export class EventBus {
  private listeners: Listeners = {};

  /**
   * @param key
   * @param listener
   * @param priority 默认 100
   */
  public on<T extends EventType>(key: T, listener: Listener<T>, priority = DEFAULT_PRIORITY) {
    this.addEventListener(key, listener, priority, false);
  }

  /**
   * @param key
   * @param listener
   * @param priority 默认 100
   */
  public once<T extends EventType>(key: T, listener: Listener<T>, priority = DEFAULT_PRIORITY) {
    this.addEventListener(key, listener, priority, true);
  }

  /**
   * @param key
   * @param listener
   * @param priority
   * @param once
   */
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

  /**
   * @param key
   * @param listener
   */
  public off<T extends EventType>(key: T, listener: Listener<T>) {
    const handler = this.listeners[key];
    if (!handler) return void 0;
    // COMPAT: 不能直接`splice` 可能会导致`trigger`时打断`forEach`
    const next = handler.filter(item => item.listener !== listener);
    (this.listeners[key] as Handler<T>[]) = next;
  }

  /**
   * @param key
   * @param payload
   * @returns prevented
   */
  public trigger<T extends EventType>(key: T, payload: EventMap[T]) {
    const handler = this.listeners[key];
    if (!handler) return false;
    const context: EventContext = {
      key: key,
      stopped: false,
      prevented: false,
      stop: () => {
        context.stopped = true;
      },
      prevent: () => {
        context.prevented = true;
      },
    };
    for (const item of handler) {
      item.listener(payload, context);
      item.once && this.off(key, item.listener);
      if (context.stopped) break;
    }
    return context.prevented;
  }

  /**
   * @description clear
   */
  public clear() {
    this.listeners = {};
  }
}
