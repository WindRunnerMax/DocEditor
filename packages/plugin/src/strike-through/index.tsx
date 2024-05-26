import type { CommandFn, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { STRIKE_THROUGH_KEY } from "./types";

export class StrikeThroughPlugin extends LeafPlugin {
  public key: string = STRIKE_THROUGH_KEY;

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[STRIKE_THROUGH_KEY];
  }

  public onCommand?: CommandFn = (editor, key, data) => {
    const marks = data.marks;
    if (marks && marks[key]) {
      setUnTextNode(editor, [key]);
    } else {
      setTextNode(editor, { [key]: true });
    }
  };

  public render(context: LeafContext): JSX.Element {
    return <del>{context.children}</del>;
  }
}
