declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [TABLE_BLOCK_KEY]?: boolean;
    [TABLE_RAW_BLOCK_KEY]?: boolean;
    [TABLE_CELL_BLOCK_KEY]?: boolean;
    [TABLE_COL_WIDTHS]?: number[];
  }
}

export const TABLE_BLOCK_KEY = "table";
export const TABLE_RAW_BLOCK_KEY = "table-raw";
export const TABLE_CELL_BLOCK_KEY = "table-cell";
export const TABLE_COL_WIDTHS = "table-col-widths";
