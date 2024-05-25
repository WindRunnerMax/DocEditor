declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [HEADING_KEY]?: { id: string; type: string };
  }
}

export const HEADING_KEY = "heading";
