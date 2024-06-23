import type { BaseNode } from "doc-editor-delta";
import { Node } from "doc-editor-delta";
import { isBlock, isText, isTextBlock } from "doc-editor-utils";

import type { EditorKit } from "../editor";

export class Clipboard {
  constructor(private editor: EditorKit) {}

  onCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const fragments = this.editor.raw.getFragment();
    // TODO: 暂时先只处理纯文本
    const parseText = (fragment: BaseNode[]): string => {
      return fragment
        .map(item => {
          if (isText(item)) {
            return Node.string(item);
          } else if (isTextBlock(this.editor.raw, item)) {
            return parseText(item.children) + "\n";
          } else if (isBlock(this.editor.raw, item)) {
            return parseText(item.children);
          } else {
            return "";
          }
        })
        .join("");
    };
    const text = parseText(fragments).replace(/\n$/, "");
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
  };
}
