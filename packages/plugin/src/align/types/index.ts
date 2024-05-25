declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [ALIGN_KEY]?: "left" | "center" | "right" | "justify";
  }
}

export const ALIGN_KEY = "align";
