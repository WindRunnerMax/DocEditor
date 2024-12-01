import type { CommandFn, LeafContext, PasteContext } from "doc-editor-core";
import type { CopyContext } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import { isHTMLElement } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { applyMarker } from "../clipboard/utils/apply";
import { isMatchTag } from "../clipboard/utils/is";
import { BOLD_KEY } from "./types";

export class BoldPlugin extends LeafPlugin {
  public readonly key = BOLD_KEY;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[BOLD_KEY];
  }

  public onCommand: CommandFn = data => {
    const marks = data.marks;
    if (marks && marks[this.key]) {
      setUnTextNode(this.editor.raw, [this.key]);
    } else {
      setTextNode(this.editor.raw, { [this.key]: true });
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

  public deserialize(context: PasteContext): void {
    const { nodes, html } = context;
    if (!isHTMLElement(html)) return void 0;
    if (isMatchTag(html, "strong") || isMatchTag(html, "b") || html.style.fontWeight === "bold") {
      context.nodes = applyMarker(nodes, { [BOLD_KEY]: true });
    }
  }

  public render(context: LeafContext): JSX.Element {
    return <strong>{context.children}</strong>;
  }
}
