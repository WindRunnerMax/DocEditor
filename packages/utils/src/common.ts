import { isEmptyValue } from "laser-utils";

export function assertValue<T>(value: T) {
  if (isEmptyValue(value)) throw new Error("assert value is empty");
  type AssertT = Exclude<T, null | undefined>;
  return value as AssertT;
}

export type AssertT<T> = Exclude<T, null | undefined>;
