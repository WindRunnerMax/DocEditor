declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [CODE_BLOCK_KEY]?: boolean;
    [CODE_BLOCK_CONFIG]?: { language: string };
    [CODE_BLOCK_ITEM_KEY]?: boolean;
  }
  interface TextElement {
    [CODE_BLOCK_TYPE]?: string;
  }
}

export const CODE_BLOCK_KEY = "code-block";
export const CODE_BLOCK_TYPE = "code-block-type";
export const CODE_BLOCK_CONFIG = "code-block-config";
export const CODE_BLOCK_ITEM_KEY = "code-block-item";
