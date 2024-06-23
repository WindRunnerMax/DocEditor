import type { CommandFn, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { UNDERLINE_KEY } from "./types";

export class UnderLinePlugin extends LeafPlugin {
  public key: string = UNDERLINE_KEY;

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[UNDERLINE_KEY];
  }

  public onCommand?: CommandFn = (editor, key, data) => {
    const marks = data.marks;
    if (marks && marks[key]) {
      setUnTextNode(editor.raw, [key]);
    } else {
      setTextNode(editor.raw, { [key]: true });
    }
  };

  public render(context: LeafContext): JSX.Element {
    return <u>{context.children}</u>;
  }
}
