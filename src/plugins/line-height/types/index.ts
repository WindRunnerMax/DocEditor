declare module "slate" {
  interface BlockElement {
    [LINE_HEIGHT_KEY]?: number;
  }
}

export const LINE_HEIGHT_KEY = "line-height";
