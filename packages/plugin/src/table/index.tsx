import "./index.scss";

import type { BlockContext, CommandFn, EditorSuite } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { BaseNode, RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { getClosestBlockPath } from "doc-editor-utils";

import { Cell } from "./components/cell";
import { Table } from "./components/table";
import { Tr } from "./components/tr";
import {
  MIN_CELL_WIDTH,
  TABLE_BLOCK_KEY,
  TABLE_CELL_BLOCK_KEY,
  TABLE_COL_WIDTHS,
  TABLE_ROW_BLOCK_KEY,
} from "./types";

export class TablePlugin extends BlockPlugin {
  public key: string = TABLE_BLOCK_KEY;

  constructor(private editor: EditorSuite, private readonly: boolean) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return (
      !!props.element[TABLE_BLOCK_KEY] ||
      !!props.element[TABLE_ROW_BLOCK_KEY] ||
      !!props.element[TABLE_CELL_BLOCK_KEY]
    );
  }

  public onCommand: CommandFn = (editor, _, { path, origin }) => {
    const blockPath = path && getClosestBlockPath(editor, path);
    if (!blockPath) return void 0;
    const [, row, col] = origin?.split(".") || [];
    const rowSize = Number(row) || 2;
    const colSize = Number(col) || 2;
    const nodes: BaseNode[] = [];
    for (let i = 0; i < rowSize; i++) {
      const rowNodes: BaseNode[] = [];
      for (let k = 0; k < colSize; k++) {
        rowNodes.push({
          [TABLE_CELL_BLOCK_KEY]: true,
          children: [
            // 块级节点需要编辑的是该节点[Line Node]
            { children: [{ text: "" }] },
          ],
        });
      }
      nodes.push({ [TABLE_ROW_BLOCK_KEY]: true, children: rowNodes });
    }
    Transforms.delete(editor, { at: blockPath, unit: "block" });
    Transforms.insertNodes(
      editor,
      {
        [TABLE_BLOCK_KEY]: true,
        [TABLE_COL_WIDTHS]: new Array(colSize).fill(MIN_CELL_WIDTH),
        children: nodes,
      },
      { at: blockPath, select: true }
    );
    Transforms.select(editor, blockPath.concat([0, 0, 0]));
  };

  public renderLine(context: BlockContext): JSX.Element {
    if (context.element[TABLE_BLOCK_KEY]) {
      return <Table context={context}>{context.children}</Table>;
    }
    const props = context.props;
    if (context.element[TABLE_ROW_BLOCK_KEY]) {
      context.plain = true;
      return <Tr context={context}>{props.children}</Tr>;
    }
    if (context.element[TABLE_CELL_BLOCK_KEY]) {
      context.plain = true;
      return (
        <Cell editor={this.editor} context={context} readonly={this.readonly}>
          {props.children}
        </Cell>
      );
    }
    return context.children;
  }
}
