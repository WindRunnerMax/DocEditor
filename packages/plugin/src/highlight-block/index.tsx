import "./index.scss";

import type { BlockContext, CommandFn, CopyContext, EditorKit, Reflex } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { assertValue, getClosestBlockPath } from "doc-editor-utils";

import { HighlightBlockWrapper } from "./components/wrapper";
import { COLOR_MAP, HIGHLIGHT_BLOCK_KEY } from "./types";

export class HighlightBlockPlugin extends BlockPlugin {
  private reflex: Reflex;
  public key: string = HIGHLIGHT_BLOCK_KEY;

  constructor(private editor: EditorKit, private readonly: boolean) {
    super();
    this.reflex = editor.reflex;
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[HIGHLIGHT_BLOCK_KEY];
  }

  public onCommand: CommandFn = (editor, _, { path }) => {
    const blockPath = path && getClosestBlockPath(editor.raw, path);
    if (!blockPath) return void 0;
    Transforms.delete(editor.raw, { at: blockPath, unit: "block" });
    Transforms.insertNodes(
      editor.raw,
      {
        [HIGHLIGHT_BLOCK_KEY]: {
          border: COLOR_MAP[0].border,
          background: COLOR_MAP[0].background,
        },
        children: [{ children: [{ text: "" }] }],
      },
      { at: blockPath, select: true }
    );
  };

  public serialize(context: CopyContext): void {
    const { node: node, html } = context;
    if (this.reflex.isBlock(node) && node[HIGHLIGHT_BLOCK_KEY]) {
      const colors = node[HIGHLIGHT_BLOCK_KEY]!;
      const border = colors.border;
      const background = colors.background;
      const div = document.createElement("div");
      div.style.border = `1px solid rgb(${border})`;
      div.style.background = `rgb(${background})`;
      // NOTE: 采用`Wrap Base Node`加原地替换的方式
      div.appendChild(html);
      context.html = div;
    }
  }

  public renderLine(context: BlockContext): JSX.Element {
    const config = assertValue(context.props.element[HIGHLIGHT_BLOCK_KEY]);
    return (
      <HighlightBlockWrapper
        editor={this.editor}
        element={context.element}
        config={config}
        readonly={this.readonly}
      >
        {context.children}
      </HighlightBlockWrapper>
    );
  }
}
