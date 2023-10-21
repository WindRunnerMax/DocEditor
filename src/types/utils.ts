type RecordKeyType = string | number | symbol;
type Merge<T, R> = Omit<Omit<T, Extract<keyof T, keyof R>> & R, never>;

type DeepMergeSignal<
  K extends RecordKeyType,
  T extends Record<RecordKeyType, unknown>,
  R extends Record<RecordKeyType, unknown>
> = R[K] extends Record<RecordKeyType, unknown>
  ? T[K] extends Record<RecordKeyType, unknown>
    ? DeepMerge<T[K], R[K]>
    : R[K]
  : R[K];

// 不能合并为`P in keyof T | keyof R` 会导致`?`标识符消失
export type DeepMerge<T extends Record<string, unknown>, R extends Record<string, unknown>> = Merge<
  {
    [K in keyof T]: K extends keyof R ? DeepMergeSignal<K, T, R> : T[K];
  },
  {
    [K in keyof R]: K extends keyof T ? DeepMergeSignal<K, T, R> : R[K];
  }
>;
