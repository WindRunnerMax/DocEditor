import type { PasteContext } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import { isText } from "doc-editor-utils";

import { CLIPBOARD_KEY } from "./types/index";
import { isMatchBlockTag } from "./utils/is";

export class ClipboardPlugin extends BlockPlugin {
  public key: string = CLIPBOARD_KEY;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(): boolean {
    return false;
  }

  public deserialize(context: PasteContext): void {
    const { nodes, html } = context;
    if (nodes.every(isText) && isMatchBlockTag(html)) {
      context.nodes = [{ children: nodes }];
    }
  }
}
