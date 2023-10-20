declare module "slate" {
  interface BlockElement {
    [ALIGN_KEY]?: "left" | "center" | "right" | "justify";
  }
}

export const ALIGN_KEY = "align";
