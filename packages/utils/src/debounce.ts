/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { isNumber } from "laser-utils";

type Fn = (...args: any[]) => any;

type DebouncedFn<T extends Fn> = T & {
  flush: () => void;
  cancel: () => void;
};

type Options = {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
};

const DEFAULT_OPTIONS: Required<Options> = {
  wait: 100,
  leading: false,
  trailing: true,
};

export const debounce = <T extends Fn>(fn: T, options: Options | number): DebouncedFn<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastThis: any;
  let lastArgs: any[] = [];
  const config = Object.assign(
    { ...DEFAULT_OPTIONS },
    isNumber(options) ? { wait: options } : options
  );
  const wait = config.wait;
  const leading = config.leading;
  const trailing = config.trailing;

  const clear = () => {
    timer && clearTimeout(timer);
    timer = null;
  };

  const invoke = () => {
    fn.apply(lastThis, lastArgs);
    clear();
  };

  const flush = () => {
    invoke();
    timer = setTimeout(clear, wait);
  };

  function debounced(this: unknown, ...args: any[]) {
    lastThis = this;
    lastArgs = args;
    if (!leading && trailing) {
      clear();
      timer = setTimeout(invoke, wait);
      return void 0;
    }
    if (leading && !trailing) {
      timer === null && invoke();
      clear();
      timer = setTimeout(clear, wait);
      return void 0;
    }
    if (leading && trailing) {
      timer === null && invoke();
      clear();
      timer = setTimeout(invoke, wait);
      return void 0;
    }
  }

  debounced.flush = flush;
  debounced.cancel = clear;
  return debounced as DebouncedFn<T>;
};
