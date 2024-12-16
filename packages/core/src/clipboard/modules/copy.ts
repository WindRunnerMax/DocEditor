import type { BaseNode } from "doc-editor-delta";
import { isText } from "doc-editor-utils";

import { EditorModule } from "../../editor/inject";
import { CALLER_TYPE, PLUGIN_TYPE } from "../../plugin/types/apply";
import { LINE_TAG, TEXT_DOC, TEXT_HTML, TEXT_PLAIN } from "../utils/constant";
import { getFragmentText, serializeHTML, writeToClipboard } from "../utils/serialize";
import type { CopyContext } from "../utils/types";

export class Copy extends EditorModule {
  public onCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L115
    event.preventDefault();
    event.stopPropagation();
    const sel = this.editor.selection.get();
    if (!sel) return void 0;
    const tuple = this.reflex.getClosestBlockTuple(sel);
    const nodes: BaseNode[] = [];
    if (sel.isCollapsed) {
      // NOTE: 在选区折叠的情况下需要特判`Void`节点类型
      if (tuple && this.reflex.isVoidNode(tuple.node)) {
        nodes.push(tuple.node);
      }
    } else {
      let fragment = this.raw.getFragment();
      while (fragment.length && fragment.length === 1) {
        fragment = fragment[0].children || [];
        // NOTE: 特判单个文本块的情况
        if (fragment.length === 1 && isText(fragment[0])) {
          break;
        }
      }
      nodes.push(...fragment);
    }
    if (!nodes.length) return void 0;
    this.copy(nodes);
    this.selection.focus();
    this.selection.set(sel);
  };

  public onCut = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/editable.tsx#L951
    event.preventDefault();
    event.stopPropagation();
    const sel = this.editor.selection.get();
    if (!sel) return void 0;
    this.onCopy(event);
    if (sel.isCollapsed) {
      const tuple = this.reflex.getClosestBlockTuple(sel);
      tuple && this.reflex.isVoidNode(tuple.node) && this.do.delete(tuple.path);
    } else {
      this.do.delete(sel);
    }
    this.selection.focus();
  };

  public copy(nodes: BaseNode[]) {
    const root = { children: nodes };
    const rootNode = this.serialize(root);
    const context: CopyContext = { node: root, html: rootNode };
    this.plugin.call(CALLER_TYPE.WILL_SET_CLIPBOARD, context);
    const plainText = getFragmentText(context.html);
    const htmlText = serializeHTML(context.html);
    const editorText = JSON.stringify(context.node.children);
    const dataTransfer = {
      [TEXT_PLAIN]: plainText,
      [TEXT_HTML]: htmlText,
      [TEXT_DOC]: editorText,
    };
    this.logger.info("Set Clipboard Data:", dataTransfer);
    writeToClipboard(dataTransfer);
  }

  private serialize(current: BaseNode): DocumentFragment;
  private serialize<T extends Node>(current: BaseNode, rootNode?: T): T;
  private serialize<T extends Node>(current: BaseNode, rootNode?: T): T {
    const root = rootNode || document.createDocumentFragment();
    if (this.reflex.isTextBlock(current)) {
      const lineFragment = document.createDocumentFragment();
      current.children.forEach(child => {
        const text = child.text || "";
        const textNode = document.createTextNode(text);
        const context: CopyContext = { node: child, html: textNode };
        this.plugin.call(CALLER_TYPE.SERIALIZE, context, PLUGIN_TYPE.INLINE);
        lineFragment.appendChild(context.html);
      });
      const context: CopyContext = { node: current, html: lineFragment };
      this.plugin.call(CALLER_TYPE.SERIALIZE, context, PLUGIN_TYPE.BLOCK);
      const lineNode = document.createElement("div");
      lineNode.setAttribute(LINE_TAG, "true");
      lineNode.appendChild(context.html);
      root.appendChild(lineNode);
      return root as T;
    }
    if (this.reflex.isBlock(current)) {
      const blockFragment = document.createDocumentFragment();
      current.children.forEach(child => this.serialize(child, blockFragment));
      const context: CopyContext = { node: current, html: blockFragment };
      this.plugin.call(CALLER_TYPE.SERIALIZE, context, PLUGIN_TYPE.BLOCK);
      root.appendChild(context.html);
      return root as T;
    }
    return root as T;
  }
}
