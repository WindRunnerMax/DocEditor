import type { BaseNode } from "doc-editor-delta";
import { isText } from "doc-editor-utils";

import { EditorModule } from "../../editor/inject";
import { CALLER_TYPE, PLUGIN_TYPE } from "../../plugin/types/constant";
import { LINE_TAG, TEXT_EDITOR, TEXT_HTML, TEXT_PLAIN } from "../utils/constant";
import { writeToClipboard } from "../utils/serialize";
import type { CopyContext } from "../utils/types";

export class Copy extends EditorModule {
  public onCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L115
    event.preventDefault();
    const sel = this.editor.selection.get();
    if (!sel) return void 0;
    const tuple = this.reflex.getClosestBlockTuple(sel);
    const nodes: BaseNode[] = [];
    if (sel.isCollapsed()) {
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
  };

  public onCut = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/editable.tsx#L951
    event.preventDefault();
    const sel = this.editor.selection.get();
    if (!sel) return void 0;
    this.onCopy(event);
    if (sel.isCollapsed()) {
      const tuple = this.reflex.getClosestBlockTuple(sel);
      tuple && this.reflex.isVoidNode(tuple.node) && this.do.delete(tuple.path);
    } else {
      this.do.delete(sel);
    }
  };

  public copy(nodes: BaseNode[]) {
    const rootNode = document.createDocumentFragment();
    const root = { children: nodes };
    this.serialize(root, rootNode);
    const plainText = rootNode.textContent || "";
    const serialize = new XMLSerializer();
    const htmlText = serialize.serializeToString(rootNode);
    const editorText = JSON.stringify(nodes);
    writeToClipboard({
      [TEXT_PLAIN]: plainText,
      [TEXT_HTML]: htmlText,
      [TEXT_EDITOR]: editorText,
    });
  }

  private serialize(current: BaseNode, root: Node) {
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
      lineNode.style.whiteSpace = "pre-wrap";
      lineNode.setAttribute(LINE_TAG, "true");
      lineNode.appendChild(lineFragment);
      return root.appendChild(lineNode);
    }
    if (this.reflex.isBlock(current)) {
      const lineFragment = document.createDocumentFragment();
      current.children.forEach(child => this.serialize(child, lineFragment));
      const context: CopyContext = { node: current, html: lineFragment };
      this.plugin.call(CALLER_TYPE.SERIALIZE, context, PLUGIN_TYPE.BLOCK);
      const lineNode = document.createElement("div");
      lineNode.appendChild(lineFragment);
      return root.appendChild(lineNode);
    }
  }
}
