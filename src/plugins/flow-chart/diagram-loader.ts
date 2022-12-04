import type * as Diagram from "embed-drawio";
let instance: typeof Diagram | null = null;

export const diagramLoader = () => {
  if (instance) return Promise.resolve(instance);
  return import(/* webpackChunkName: "embed-drawio" */ "embed-drawio").then(
    res => (instance = res)
  );
};
