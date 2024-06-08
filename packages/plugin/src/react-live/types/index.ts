declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [REACT_LIVE_KEY]?: boolean;
  }
  interface TextElement {
    [REACT_LIVE_TYPE]?: string;
  }
}

export const REACT_LIVE_KEY = "react-live";
export const REACT_LIVE_TYPE = "react-live-type";
