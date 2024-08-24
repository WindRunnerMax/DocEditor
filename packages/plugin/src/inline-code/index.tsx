import "./styles/index.scss";

import type { CommandFn, EditorKit, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { INLINE_CODE_KEY } from "./types";

export class InlineCodePlugin extends LeafPlugin {
  public key: string = INLINE_CODE_KEY;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[INLINE_CODE_KEY];
  }

  public onCommand: CommandFn = data => {
    const key = this.key;
    const editor = this.editor;
    const marks = data.marks;
    if (marks && marks[key]) {
      setUnTextNode(editor.raw, [key]);
    } else {
      setTextNode(editor.raw, { [key]: true });
    }
  };

  public render(context: LeafContext): JSX.Element {
    return <code className="slate-inline-code">{context.children}</code>;
  }
}
