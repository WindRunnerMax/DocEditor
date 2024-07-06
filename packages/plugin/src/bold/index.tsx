import type { CommandFn, LeafContext } from "doc-editor-core";
import type { CopyContext } from "doc-editor-core";
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

  public serialize(context: CopyContext) {
    const { node, html } = context;
    if (node[BOLD_KEY]) {
      const strong = document.createElement("strong");
      // NOTE: 采用`Wrap Base Node`加原地替换的方式
      strong.appendChild(html);
      context.html = strong;
    }
  }

  public render(context: LeafContext): JSX.Element {
    return <strong>{context.children}</strong>;
  }
}
