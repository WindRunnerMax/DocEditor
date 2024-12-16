import type { BaseNode } from "doc-editor-delta";
import { TSON } from "doc-editor-utils";

import { EditorModule } from "../../editor/inject";
import { CALLER_TYPE } from "../../plugin/types/apply";
import { EDITOR_STATE } from "../../state/types";
import { TEXT_DOC, TEXT_HTML, TEXT_PLAIN } from "../utils/constant";
import { isDOMText } from "../utils/deserialize";
import type { PasteContext, PasteNodesContext } from "../utils/types";

export class Paste extends EditorModule {
  public onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L224
    event.preventDefault();
    event.stopPropagation();
    const transfer = event.clipboardData;
    if (!transfer || this.state.get(EDITOR_STATE.READ_ONLY)) {
      return void 0;
    }
    const files = Array.from(transfer.files);
    const textDoc = transfer.getData(TEXT_DOC);
    const textHTML = transfer.getData(TEXT_HTML);
    const textPlain = transfer.getData(TEXT_PLAIN);
    this.logger.info("Paste Clipboard Data:", {
      files: files,
      [TEXT_DOC]: textDoc,
      [TEXT_HTML]: textHTML,
      [TEXT_PLAIN]: textPlain,
    });
    if (textDoc) {
      const nodes = TSON.parse<BaseNode[]>(textDoc);
      return nodes && this.applyNodes(nodes);
    }
    if (files.length) {
      return this.processFiles(files);
    }
    if (textHTML) {
      const parser = new DOMParser();
      const html = parser.parseFromString(textHTML, TEXT_HTML);
      if (!html.body || !html.body.hasChildNodes()) return void 0;
      const rootNodes: BaseNode[] = this.deserialize(html.body);
      return this.applyNodes(rootNodes);
    }
    if (textPlain) {
      return this.processPlainText(transfer);
    }
  };

  private processPlainText = (transfer: DataTransfer) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L224
    this.raw.insertTextData(transfer);
  };

  private processFiles = (files: File[]) => {
    const context: PasteContext = { html: document.createDocumentFragment(), nodes: [], files };
    this.plugin.call(CALLER_TYPE.DESERIALIZE, context);
    this.applyNodes(context.nodes);
  };

  private deserialize(current: Node): BaseNode[] {
    const root: BaseNode[] = [];
    // NOTE: 结束条件 `Text`、`Image`等节点都会在此时处理
    if (current.childNodes.length === 0) {
      if (isDOMText(current)) {
        const text = current.textContent || "";
        root.push({ text });
      } else {
        const context: PasteContext = { nodes: root, html: current };
        this.plugin.call(CALLER_TYPE.DESERIALIZE, context);
        return context.nodes;
      }
      return root;
    }
    const children = Array.from(current.childNodes);
    for (const child of children) {
      const nodes = this.deserialize(child);
      nodes.length && root.push(...nodes);
    }
    const context: PasteContext = { nodes: root, html: current };
    this.plugin.call(CALLER_TYPE.DESERIALIZE, context);
    return context.nodes;
  }

  private applyNodes(nodes: BaseNode[]) {
    const context: PasteNodesContext = { nodes };
    this.plugin.call(CALLER_TYPE.WILL_PASTE_NODES, context);
    this.logger.info("Editor Will Apply:", context.nodes);
    try {
      this.raw.insertFragment(context.nodes);
    } catch (error) {
      this.logger.error("Editor InsertFragment Error:", error, context.nodes);
    }
  }
}
