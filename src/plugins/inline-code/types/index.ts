declare module "slate" {
  interface TextElement {
    [INLINE_CODE_KEY]?: boolean;
  }
}

export const INLINE_CODE_KEY = "inline-code";
