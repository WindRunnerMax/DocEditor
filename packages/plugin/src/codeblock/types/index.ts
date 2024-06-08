declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [CODE_BLOCK_KEY]?: boolean;
    [CODE_BLOCK_CONFIG]?: { language: string };
  }
  interface TextElement {
    [CODE_BLOCK_TYPE]?: string;
  }
}

export const CODE_BLOCK_KEY = "code-block";
export const CODE_BLOCK_TYPE = "code-block-type";
export const CODE_BLOCK_CONFIG = "code-block-config";
