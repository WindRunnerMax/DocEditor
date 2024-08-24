import "./styles/index.scss";

import type { BlockContext, CommandFn, EditorKit } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import { DEFAULT_PRIORITY, getBlockAttributes } from "doc-editor-utils";
import { isBlock } from "doc-editor-utils";
import { setUnBlockNode } from "doc-editor-utils";

import { PARAGRAPH_KEY } from "./types";

export class ParagraphPlugin extends BlockPlugin {
  public key: string = PARAGRAPH_KEY;
  public priority: number = DEFAULT_PRIORITY + 11;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(): boolean {
    return true;
  }

  public onCommand: CommandFn = data => {
    const editor = this.editor;
    const element = data.element;
    const path = data.path;
    if (!element || !path || !isBlock(editor.raw, element)) return void 0;
    const attributes = getBlockAttributes(element);
    setUnBlockNode(editor.raw, Object.keys(attributes), { at: path });
  };

  public renderLine(context: BlockContext): JSX.Element {
    return (
      <div className="doc-line" data-paragraph>
        {context.children}
      </div>
    );
  }
}
