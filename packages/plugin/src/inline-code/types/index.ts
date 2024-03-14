declare module "doc-editor-delta" {
  interface TextElement {
    [INLINE_CODE_KEY]?: boolean;
  }
}

export const INLINE_CODE_KEY = "inline-code";
