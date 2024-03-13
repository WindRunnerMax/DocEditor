import { isString } from "./is";

export const classes = (...values: unknown[]) => {
  return values.filter(it => isString(it)).join(" ");
};
export const cs = classes;
