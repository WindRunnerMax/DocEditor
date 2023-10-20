declare module "slate" {
  interface BlockElement {
    [DIVIDING_LINE_KEY]?: boolean;
  }
}

export const DIVIDING_LINE_KEY = "dividing-line";
