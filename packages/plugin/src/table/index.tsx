import "./styles/index.scss";
import "./styles/toolbar.scss";

import type { BlockContext, CommandFn, EditorKit, EditorRaw } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT } from "doc-editor-core";
import type { BaseNode, RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { getClosestBlockPath } from "doc-editor-utils";

import type { SelectChangeEvent } from "../shared/types/event";
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
import type { TableViewEvents } from "./types/interface";

export class TablePlugin extends BlockPlugin {
  private raw: EditorRaw;
  public key: string = TABLE_BLOCK_KEY;
  private views: TableViewEvents[];

  constructor(private editor: EditorKit, private readonly: boolean) {
    super();
    this.views = [];
    this.raw = editor.raw;
    editor.event.on(EDITOR_EVENT.SELECTION_CHANGE, this.onSelectionChange);
  }

  public destroy(): void {
    this.views = [];
    this.editor.event.off(EDITOR_EVENT.SELECTION_CHANGE, this.onSelectionChange);
  }

  public match(props: RenderElementProps): boolean {
    return (
      !!props.element[TABLE_BLOCK_KEY] ||
      !!props.element[TABLE_ROW_BLOCK_KEY] ||
      !!props.element[TABLE_CELL_BLOCK_KEY]
    );
  }

  public onCommand: CommandFn = ({ path, origin }) => {
    const blockPath = path && getClosestBlockPath(this.raw, path);
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
    Transforms.delete(this.raw, { at: blockPath, unit: "block" });
    Transforms.insertNodes(
      this.raw,
      {
        [TABLE_BLOCK_KEY]: true,
        [TABLE_COL_WIDTHS]: new Array(colSize).fill(MIN_CELL_WIDTH),
        children: nodes,
      },
      { at: blockPath, select: true }
    );
    Transforms.select(this.raw, blockPath.concat([0, 0, 0]));
  };

  private onTableMount = (fns: TableViewEvents) => {
    this.views.push(fns);
  };

  private onTableUnMount = (fns: TableViewEvents) => {
    const index = this.views.indexOf(fns);
    if (index !== -1) this.views.splice(index, 1);
  };

  private onSelectionChange = (event: SelectChangeEvent) => {
    this.views.forEach(view => view.onEditorSelectionChange(event));
  };

  public renderLine(context: BlockContext): JSX.Element {
    if (context.element[TABLE_BLOCK_KEY]) {
      return (
        <Table
          onMount={this.onTableMount}
          onUnMount={this.onTableUnMount}
          editor={this.editor}
          readonly={this.readonly}
          context={context}
        >
          {context.children}
        </Table>
      );
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
