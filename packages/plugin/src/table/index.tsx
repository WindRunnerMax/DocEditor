import "./index.scss";

import type { BlockContext, CommandFn, EditorSuite } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { getAboveBlockPath } from "doc-editor-utils";

import { TABLE_BLOCK_KEY, TABLE_CELL_BLOCK_KEY, TABLE_RAW_BLOCK_KEY } from "./types";

export class TablePlugin extends BlockPlugin {
  public key: string = TABLE_BLOCK_KEY;

  constructor(private editor: EditorSuite, private readonly: boolean) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return (
      !!props.element[TABLE_BLOCK_KEY] ||
      !!props.element[TABLE_RAW_BLOCK_KEY] ||
      !!props.element[TABLE_CELL_BLOCK_KEY]
    );
  }

  public onCommand: CommandFn = (editor, _, { path }) => {
    const blockPath = path && getAboveBlockPath(editor, path);
    if (!blockPath) return void 0;
    Transforms.delete(editor, { at: blockPath, unit: "block" });
    Transforms.insertNodes(
      editor,
      {
        [TABLE_BLOCK_KEY]: true,
        children: [
          {
            [TABLE_RAW_BLOCK_KEY]: true,
            children: [
              { [TABLE_CELL_BLOCK_KEY]: true, children: [{ children: [{ text: "" }] }] },
              { [TABLE_CELL_BLOCK_KEY]: true, children: [{ children: [{ text: "" }] }] },
            ],
          },
          {
            [TABLE_RAW_BLOCK_KEY]: true,
            children: [
              { [TABLE_CELL_BLOCK_KEY]: true, children: [{ children: [{ text: "" }] }] },
              { [TABLE_CELL_BLOCK_KEY]: true, children: [{ children: [{ text: "" }] }] },
            ],
          },
        ],
      },
      { at: blockPath, select: true }
    );
    Transforms.select(editor, blockPath.concat([0, 0, 0]));
  };

  public renderLine(context: BlockContext): JSX.Element {
    const props = context.props;
    if (context.element[TABLE_BLOCK_KEY]) {
      return (
        <div className="table-block-wrapper">
          <table className="table-block">
            <tbody>{context.children}</tbody>
          </table>
        </div>
      );
    }
    if (context.element[TABLE_RAW_BLOCK_KEY]) {
      context.plain = true;
      return (
        <tr className="table-block-tr" {...props.attributes}>
          {props.children}
        </tr>
      );
    }
    if (context.element[TABLE_CELL_BLOCK_KEY]) {
      context.plain = true;
      return (
        <td className="table-block-cell" {...props.attributes}>
          {props.children}
        </td>
      );
    }
    return context.children;
  }
}
