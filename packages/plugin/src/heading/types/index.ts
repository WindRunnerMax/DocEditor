declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [HEADING_KEY]?: { id: string; type: string };
  }
}

export const HEADING_KEY = "heading";
export const H1 = "h1";
export const H2 = "h2";
export const H3 = "h3";
