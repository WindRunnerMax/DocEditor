declare module "doc-editor-delta/dist/interface" {
  interface TextElement {
    [STRIKE_THROUGH_KEY]?: boolean;
  }
}

export const STRIKE_THROUGH_KEY = "strike-through";
