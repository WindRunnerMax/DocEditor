declare module "slate" {
  interface BlockElement {
    [HEADING_KEY]?: { id: string; type: string };
  }
}

export const HEADING_KEY = "heading";
