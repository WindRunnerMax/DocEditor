declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [QUOTE_BLOCK_KEY]?: boolean;
    [QUOTE_BLOCK_ITEM_KEY]?: boolean;
  }
}

export const QUOTE_BLOCK_KEY = "quote-block";
export const QUOTE_BLOCK_ITEM_KEY = "quote-block-item";
