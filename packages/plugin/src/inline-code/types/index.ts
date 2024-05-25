declare module "doc-editor-delta/dist/interface" {
  interface TextElement {
    [INLINE_CODE_KEY]?: boolean;
  }
}

export const INLINE_CODE_KEY = "inline-code";
