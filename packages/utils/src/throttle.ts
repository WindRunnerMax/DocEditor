/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Func } from "laser-utils";
import { isNil, isNumber } from "laser-utils";

type Fn = Func.Any;
type ThrottledFn<T extends Fn> = T & {
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
  leading: true,
  trailing: true,
};

export const throttle = <T extends Fn>(fn: T, options: Options | number): ThrottledFn<T> => {
  let lastThis: any;
  let lastArgs: any[] = [];
  let lastInvokeTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
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
    lastInvokeTime = Date.now();
    fn.apply(lastThis, lastArgs);
    clear();
  };

  const flush = () => {
    invoke();
    if (leading && !trailing) {
      timer = setTimeout(clear, wait);
    }
  };

  function throttled(this: unknown, ...args: any[]) {
    lastThis = this;
    lastArgs = args;
    const now = Date.now();
    if (leading && trailing && isNil(timer)) {
      // 此处没有处理多次调用才会触发`trailing`的情况
      // 即单次调用也会同时触发`leading`和`trailing`
      // 如果必须要的话就将后续的`timer`赋值写入`else`
      now - lastInvokeTime > wait && invoke();
      timer = setTimeout(invoke, wait);
      return void 0;
    }
    if (!leading && trailing && isNil(timer)) {
      timer = setTimeout(invoke, wait);
      return void 0;
    }
    if (leading && !trailing && isNil(timer)) {
      invoke();
      timer = setTimeout(clear, wait);
      return void 0;
    }
  }

  throttled.flush = flush;
  throttled.cancel = clear;
  return throttled as ThrottledFn<T>;
};
