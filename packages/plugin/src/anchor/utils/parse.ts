import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { getUniqueId } from "doc-editor-utils";

import { H1, H2, H3, HEADING_KEY } from "../../heading/types";

export type Anchor = {
  id: string;
  title: string;
  level: number;
};

export const parseAnchor = (editor: EditorKit): Anchor[] => {
  const list: Anchor[] = [];
  let minLevel = Infinity;
  const set = new Set<string>();
  editor.raw.children.forEach(node => {
    const heading = (<BlockElement>node)[HEADING_KEY];
    if (heading && node.children && heading.id && heading.type) {
      let id = heading.id;
      const text = node.children.map(child => child.text || "").join("");
      let level = 0;
      if (heading.type === H1) {
        level = 0;
      } else if (heading.type === H2) {
        level = 1;
      } else if (heading.type === H3) {
        level = 2;
      }
      if (set.has(id)) {
        console.warn(`Anchor id: ${heading.id} is duplicated`);
        id = getUniqueId(6);
      }
      set.add(heading.id);
      minLevel = Math.min(minLevel, level);
      list.push({ id: id, title: text, level: level });
    }
  });
  // 取最低的层级
  list.forEach(anchor => {
    anchor.level = anchor.level - minLevel;
  });
  return list;
};
