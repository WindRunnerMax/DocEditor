import type { Func } from "doc-editor-utils";
import type { DependencyList, EffectCallback, MutableRefObject, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 当前组件挂载状态
 */
export const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { isMounted: () => isMounted.current, mounted: isMounted };
};

/**
 * 安全地使用 useState
 * @param value 状态
 * @param mounted 组件挂载状态 useIsMounted
 */
export const useMountState = <S = undefined>(value: S, mounted: MutableRefObject<boolean>) => {
  const [state, setStateOrigin] = useState<S>(value);

  const setCurrentState = useCallback((next: SetStateAction<S>) => {
    if (!mounted.current) return void 0;
    setStateOrigin(next);
  }, []);

  return [state, setCurrentState] as const;
};

/**
 * 安全地使用 useState
 * @param value 状态
 */
export const useSafeState = <S = undefined>(value: S) => {
  const [state, setStateOrigin] = useState<S>(value);
  const { mounted } = useIsMounted();

  const setCurrentState = useCallback((next: SetStateAction<S>) => {
    if (!mounted.current) return void 0;
    setStateOrigin(next);
  }, []);

  return [state, setCurrentState] as const;
};

/**
 * State 与 Ref 的使用与更新
 * @param value 状态
 */
export const useStateRef = <S = undefined>(value: S) => {
  const [state, setStateOrigin] = useState<S>(value);
  const { mounted } = useIsMounted();
  const ref = useRef(state);

  const setState = useCallback((next: S) => {
    if (!mounted.current) return void 0;
    ref.current = next;
    setStateOrigin(next);
  }, []);

  return [state, setState, ref] as const;
};

/**
 * 避免挂载时触发副作用
 * @param effect 副作用依赖
 */
export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

/**
 * 保证 re-render 时的同一函数引用
 * @param fn Func.Any
 */
export const useMemoFn = <T extends Func.Any>(fn: T) => {
  const fnRef = useRef(fn);
  const memoFn = useRef<Func.Any>();

  fnRef.current = fn;
  if (!memoFn.current) {
    memoFn.current = function (this: unknown, ...args: unknown[]) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoFn.current as T;
};
