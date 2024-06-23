import type { CommandFn, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { BOLD_KEY } from "./types";

export class BoldPlugin extends LeafPlugin {
  public readonly key = BOLD_KEY;

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[BOLD_KEY];
  }

  public onCommand: CommandFn = (editor, key, data) => {
    const marks = data.marks;
    if (marks && marks[key]) {
      setUnTextNode(editor.raw, [key]);
    } else {
      setTextNode(editor.raw, { [key]: true });
    }
  };

  public render(context: LeafContext): JSX.Element {
    return <strong>{context.children}</strong>;
  }
}
