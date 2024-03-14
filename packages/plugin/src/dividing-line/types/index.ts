declare module "doc-editor-delta" {
  interface BlockElement {
    [DIVIDING_LINE_KEY]?: boolean;
  }
}

export const DIVIDING_LINE_KEY = "dividing-line";
