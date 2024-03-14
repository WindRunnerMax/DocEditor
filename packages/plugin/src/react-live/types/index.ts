declare module "doc-editor-delta" {
  interface BlockElement {
    [REACT_LIVE_KEY]?: boolean;
    [REACT_LIVE_ITEM_KEY]?: boolean;
  }
  interface TextElement {
    [REACT_LIVE_TYPE]?: string;
  }
}

export const REACT_LIVE_KEY = "react-live";
export const REACT_LIVE_TYPE = "react-live-type";
export const REACT_LIVE_ITEM_KEY = "react-live-item";
