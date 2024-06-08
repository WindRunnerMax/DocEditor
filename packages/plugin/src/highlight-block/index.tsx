import "./index.scss";

import type { BlockContext, CommandFn, EditorSuite } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { assertValue, getBlockPath } from "doc-editor-utils";

import { HighlightBlockWrapper } from "./components/wrapper";
import { COLOR_MAP, HIGHLIGHT_BLOCK_KEY } from "./types";

export class HighlightBlockPlugin extends BlockPlugin {
  public key: string = HIGHLIGHT_BLOCK_KEY;

  constructor(private editor: EditorSuite, private readonly: boolean) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[HIGHLIGHT_BLOCK_KEY];
  }

  public onCommand: CommandFn = (editor, _, { path }) => {
    const blockPath = path && getBlockPath(editor, path);
    if (!blockPath) return void 0;
    Transforms.delete(editor, { at: blockPath, unit: "block" });
    Transforms.insertNodes(
      editor,
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
