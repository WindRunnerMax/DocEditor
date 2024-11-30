import { Editor, Point } from "doc-editor-delta";
import { Range } from "doc-editor-delta";
import { getNodeTupleByDepth, isBlock } from "doc-editor-utils";

import type { EditorKit } from "../editor";
import type { EditorRaw } from "../editor/types";
import { CALLER_TYPE, PLUGIN_TYPE } from "../plugin/types/apply";
import { NormalizeRules } from "./rules";
import type { EditorSchema } from "./types";

export class Schema extends NormalizeRules {
  public readonly editor: EditorKit;
  public readonly raw: EditorSchema;

  constructor(schema: EditorSchema, editor: EditorKit) {
    super();
    this.raw = schema;
    this.editor = editor;
    for (const [key, value] of Object.entries(schema)) {
      if (value.void) {
        this.void.add(key);
        this.block.add(key);
      }
      if (value.block) {
        this.block.add(key);
      }
      if (value.wrap) {
        this.block.add(value.wrap);
        this.wrap.set(value.wrap, key);
        this.pair.set(key, value.wrap);
      }
      if (value.instance) {
        this.instance.add(key);
      }
    }
  }

  public with(editor: Editor): EditorRaw {
    const { isVoid, normalizeNode, isInline, deleteBackward } = editor;

    editor.isInline = element => {
      for (const key of Object.keys(element)) {
        if (this.inline.has(key)) return true;
      }
      return isInline(element);
    };

    editor.isVoid = element => {
      for (const key of Object.keys(element)) {
        if (this.void.has(key)) return true;
      }
      return isVoid(element);
    };

    editor.normalizeNode = entry => {
      const [node] = entry;
      this.normalizeEmptyEditor(editor, node);
      if (!isBlock(editor, node)) {
        normalizeNode(entry);
        return void 0;
      }
      this.normalize(editor, entry);
      if (this.editor.plugin) {
        this.editor.plugin.call(CALLER_TYPE.NORMALIZE, entry, PLUGIN_TYPE.BLOCK);
      }
      normalizeNode(entry);
    };

    editor.deleteBackward = (unit: Parameters<typeof deleteBackward>[0]) => {
      const selection = editor.selection;
      if (!selection || !Range.isCollapsed(selection)) {
        deleteBackward(unit);
        return void 0;
      }
      const target = getNodeTupleByDepth(editor, selection.anchor.path, 2);
      // 由于`Normalize`的存在 这里直接取直属祖先节点判断即可
      if (target && isBlock(editor, target.node)) {
        const { node, path } = target;
        // 由于不存在统一的节点调度 所以只能遍历查找节点
        for (const key of Object.keys(node)) {
          // 当处于`Instance Node`节点的最起始位置时 不允许直接调度删除逻辑
          if (this.instance.has(key)) {
            // 在这里会查找`Text`节点组装`Path`
            // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/node.ts
            const start = Editor.start(editor, path);
            if (Point.equals(selection.anchor, start)) {
              return void 0;
            }
          }
        }
      }
      deleteBackward(unit);
    };

    return editor as EditorRaw;
  }
}
