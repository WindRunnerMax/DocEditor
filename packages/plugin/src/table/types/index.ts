declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [TABLE_BLOCK_KEY]?: boolean;
    [TABLE_ROW_BLOCK_KEY]?: boolean;
    [TABLE_CELL_BLOCK_KEY]?: boolean;
    [TABLE_COL_WIDTHS]?: number[];
    [CELL_COL_SPAN]?: number;
    [CELL_ROW_SPAN]?: number;
  }
}

export const TABLE_BLOCK_KEY = "table";
export const TABLE_ROW_BLOCK_KEY = "table-row";
export const TABLE_CELL_BLOCK_KEY = "table-cell";
export const TABLE_COL_WIDTHS = "table-col-widths";
export const CELL_COL_SPAN = "cell-col-span";
export const CELL_ROW_SPAN = "cell-row-span";
export const MIN_CELL_WIDTH = 100;
