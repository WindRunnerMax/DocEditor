import type { BaseNode } from "doc-editor-delta";

import type { ElementType } from "../plugin/types/constant";

export type CopyContext = {
  node: BaseNode;
  html: HTMLElement;
  stop: () => void;
};

export type PasteContext = {
  type: ElementType;
  node: BaseNode;
  html: HTMLElement;
  files?: File[];
  stop: () => void;
};
