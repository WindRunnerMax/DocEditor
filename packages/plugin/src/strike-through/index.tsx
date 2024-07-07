import type { CommandFn, EditorKit, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { STRIKE_THROUGH_KEY } from "./types";

export class StrikeThroughPlugin extends LeafPlugin {
  public key: string = STRIKE_THROUGH_KEY;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[STRIKE_THROUGH_KEY];
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
    return <del>{context.children}</del>;
  }
}
