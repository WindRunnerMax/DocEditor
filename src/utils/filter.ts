import { isObject } from "./is";

type RecordObject = Record<string | number | symbol, unknown>;

export function omit<T extends Array<unknown>>(target: T, keys: T): T;
export function omit<T extends RecordObject, K extends keyof T>(target: T, keys: K[]): Omit<T, K>;
export function omit<T extends Array<unknown> | RecordObject>(
  target: T,
  keys: unknown[]
): T | RecordObject {
  const keySet = new Set(keys);
  return isObject(target)
    ? Object.keys(target).reduce(
        (pre, cur) => (keySet.has(cur) ? pre : { ...pre, [cur]: target[cur] }),
        {}
      )
    : target.filter(item => !keySet.has(item));
}

export function pick<T extends RecordObject, K extends keyof T>(target: T, keys: K[]): Pick<T, K> {
  const keySet: Set<unknown> = new Set(keys);
  const a = Object.keys(target);
  return a.reduce(
    (pre, cur) => (keySet.has(cur) ? { ...pre, [cur]: target[cur] } : pre),
    {} as Pick<T, K>
  );
}
