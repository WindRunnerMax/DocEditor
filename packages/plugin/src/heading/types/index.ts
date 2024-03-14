declare module "doc-editor-delta" {
  interface BlockElement {
    [HEADING_KEY]?: { id: string; type: string };
  }
}

export const HEADING_KEY = "heading";
