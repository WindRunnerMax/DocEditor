import type { CommandFn, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { ITALIC_KEY } from "./types";

export class ItalicPlugin extends LeafPlugin {
  public key: string = ITALIC_KEY;

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[ITALIC_KEY];
  }

  public onCommand: CommandFn = (editor, key, data) => {
    const marks = data.marks;
    if (marks && marks[key]) {
      setUnTextNode(editor, [key]);
    } else {
      setTextNode(editor, { [key]: true });
    }
  };

  public render(context: LeafContext): JSX.Element {
    return <em>{context.children}</em>;
  }
}
