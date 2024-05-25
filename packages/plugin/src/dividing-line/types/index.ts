declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [DIVIDING_LINE_KEY]?: boolean;
  }
}

export const DIVIDING_LINE_KEY = "dividing-line";
