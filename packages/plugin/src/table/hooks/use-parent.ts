import type { BlockElement } from "doc-editor-delta";

import { NODE_TO_PARENT } from "../utils/node";

export const useParent = (element: BlockElement) => {
  const parent = NODE_TO_PARENT.get(element) || null;
  return { parent };
};
