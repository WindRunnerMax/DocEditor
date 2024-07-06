import type { BaseNode } from "doc-editor-delta";
import { TSON } from "doc-editor-utils";

import { EditorModule } from "../../editor/inject";
import { CALLER_TYPE } from "../../plugin/types/constant";
import { EDITOR_STATE } from "../../state/types";
import { TEXT_DOC, TEXT_HTML, TEXT_PLAIN } from "../utils/constant";
import type { PasteNodesContext } from "../utils/types";

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
    if (textHTML || files.length) {
      return this.deserialize(textHTML, files);
    }
    if (textPlain) {
      return this.handlePlainText(transfer);
    }
  };

  private handlePlainText = (transfer: DataTransfer) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L224
    this.raw.insertTextData(transfer);
  };

  private deserialize(textHTML: string, files: File[]) {}

  private applyNodes(nodes: BaseNode[]) {
    const context: PasteNodesContext = { nodes };
    this.plugin.call(CALLER_TYPE.WILL_PASTE_NODES, context);
    this.raw.insertFragment(context.nodes);
  }
}
