import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";

import { H1, H2, H3, HEADING_KEY } from "../../heading/types";

export type Anchor = {
  id: string;
  title: string;
  level: number;
};

export const parseAnchor = (editor: EditorKit): Anchor[] => {
  const list: Anchor[] = [];
  let minLevel = Infinity;
  editor.raw.children.forEach(node => {
    const heading = (<BlockElement>node)[HEADING_KEY];
    if (heading && node.children && heading.id && heading.type) {
      const text = node.children.map(child => child.text || "").join("");
      let level = 0;
      if (heading.type === H1) {
        level = 0;
      } else if (heading.type === H2) {
        level = 1;
      } else if (heading.type === H3) {
        level = 2;
      }
      minLevel = Math.min(minLevel, level);
      list.push({ id: heading.id, title: text, level: level });
    }
  });
  // 取最低的层级
  list.forEach(anchor => {
    anchor.level = anchor.level - minLevel;
  });
  return list;
};
