import type { Array } from "laser-utils";
import type { Object } from "laser-utils";
import { isArray, isObject } from "laser-utils";

export class Collection {
  /**
   * Pick
   * @param target Object.Any
   * @param keys keyof target
   */
  public static pick<T extends Object.Any, K extends keyof T>(
    target: T,
    keys: K | K[]
  ): Pick<T, K> {
    const set: Set<unknown> = new Set(isArray(keys) ? keys : [keys]);
    const next = {} as T;
    for (const key in target) {
      if (!set.has(key)) continue;
      next[key] = target[key];
    }
    return next;
  }

  /**
   * Omit
   * @param target Array.Any | Object.Any
   * @param keys Array.Any
   */
  public static omit<T extends Array.Any>(target: T, keys: T): T;
  public static omit<T extends Object.Any, K extends keyof T>(target: T, keys: K | K[]): Omit<T, K>;
  public static omit<T extends Array.Any | Object.Any>(target: T, keys: Array.Any): T | Object.Any {
    const set = new Set(isArray(keys) ? keys : [keys]);
    if (isObject(target)) {
      const next = {} as Object.Unknown;
      for (const key in target) {
        if (set.has(key)) continue;
        next[key] = target[key];
      }
      return next;
    }
    return target.filter(item => !set.has(item));
  }

  /**
   * Patch
   * @param a Set<T> | T[]
   * @param b Set<T> | T[]
   */
  public static patch<T>(a: Set<T> | T[], b: Set<T> | T[]) {
    const prev = a instanceof Set ? a : new Set(a);
    const next = b instanceof Set ? b : new Set(b);
    const effects: T[] = [];
    const added: T[] = [];
    const removed: T[] = [];
    for (const id of next) {
      if (!prev.has(id)) added.push(id);
    }
    for (const id of prev) {
      if (!next.has(id)) removed.push(id);
    }
    effects.push(...added, ...removed);
    return { effects, added, removed };
  }

  /**
   * Union
   * @param a Set<T> | T[]
   * @param b Set<T> | T[]
   */
  public static union<T>(a: Set<T> | T[], b: Set<T> | T[]) {
    return [...a, ...b];
  }

  /**
   * Intersection
   * @param a Set<T> | T[]
   * @param b Set<T> | T[]
   */
  public static intersection<T>(a: Set<T> | T[], b: Set<T> | T[]) {
    const prev = [...a];
    const next = b instanceof Set ? b : new Set(b);
    return new Set([...prev].filter(id => next.has(id)));
  }
}
