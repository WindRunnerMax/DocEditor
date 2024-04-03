import type { BaseNode, Path } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { isBlock, isText, isTextBlock, setBlockNode, setUnBlockNode } from "doc-editor-utils";
import { isDev } from "doc-editor-utils";

import type { EditorSuite } from "../editor/types";
import type { EditorSchema } from "./types";

export class Schema {
  private voids: Set<string> = new Set<string>();
  private blocks: Set<string> = new Set<string>();
  private wrapper: Map<string, string> = new Map();
  private packaged: Map<string, string> = new Map();

  constructor(schema: EditorSchema) {
    for (const [key, value] of Object.entries(schema)) {
      if (value.void) {
        this.voids.add(key);
        this.blocks.add(key);
      }
      if (value.block) {
        this.blocks.add(key);
      }
      if (value.wrap) {
        this.blocks.add(value.wrap);
        this.wrapper.set(value.wrap, key);
        this.packaged.set(key, value.wrap);
      }
    }
  }

  with(editor: Editor): EditorSuite {
    const { isVoid, normalizeNode } = editor;

    editor.isVoid = element => {
      for (const key of Object.keys(element)) {
        if (this.voids.has(key)) return true;
      }
      return isVoid(element);
    };

    editor.normalizeNode = entry => {
      const [node, path] = entry;
      const batch: (() => void)[] = [];

      if (!isBlock(editor, node)) {
        normalizeNode(entry);
        return void 0;
      }

      // `Normalize Wrap Node`
      for (const key of Object.keys(node)) {
        // `Wrapper Node`
        if (this.wrapper.has(key)) {
          const packagedKey = this.wrapper.get(key) as string;
          // 深度优先遍历
          // 路径上一定需要存在`Packaged Key`
          // 否则在`Text Node`上加入`Packaged Key`
          const dfs = (cur: BaseNode, path: Path) => {
            if (isText(cur)) {
              return void 0;
            }
            if (isBlock(editor, cur) && cur[packagedKey]) {
              return void 0;
            }
            if (isTextBlock(editor, cur)) {
              // `Text Block Node`一定是最后最后一个`Block Node`
              if (isDev) {
                console.log("NormalizeWrapperNode: ", path, `${key}--${packagedKey}`);
              }
              batch.push(() => setBlockNode(editor, { [packagedKey]: true }, { at: path }));
              return void 0;
            }
            const children = cur.children;
            if (!children) return void 0;
            for (let i = 0; i < children.length; i++) {
              dfs(children[i], path.concat(i));
            }
          };
          dfs(node, path);
        }

        // `Packaged Node`
        if (this.packaged.has(key)) {
          const wrapperKey = this.packaged.get(key) as string;
          let matchWrapperNode = false;
          let parent = Editor.parent(editor, path);
          // 从当前节点向上遍历
          // 路径上一定需要存在`Wrapper Node`
          // 否则在`Base Node`上删除`Packaged Key`
          while (parent && parent[0] && parent[1] && isBlock(editor, parent[0])) {
            const cur = parent[0];
            if (cur[wrapperKey]) {
              matchWrapperNode = true;
              break;
            }
            parent = Editor.parent(editor, parent[1]);
          }
          if (!matchWrapperNode) {
            if (isDev) {
              console.log("NormalizePackagedNode: ", path, `${wrapperKey}--${key}`);
            }
            batch.push(() => setUnBlockNode(editor, [key], { at: path }));
          }
        }
      }

      batch.forEach(fn => fn());
      normalizeNode(entry);
    };

    return editor as EditorSuite;
  }
}
