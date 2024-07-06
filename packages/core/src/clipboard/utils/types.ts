import type { BaseNode } from "doc-editor-delta";

import type { PluginType } from "../../plugin/types/constant";

export type CopyContext = {
  node: BaseNode;
  html: Node;
};

export type PasteContext = {
  type: PluginType;
  node: BaseNode;
  html: Node;
  files?: File[];
};
