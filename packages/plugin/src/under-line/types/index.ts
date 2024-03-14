declare module "doc-editor-delta" {
  interface TextElement {
    [UNDERLINE_KEY]?: boolean;
  }
}

export const UNDERLINE_KEY = "under-line";
