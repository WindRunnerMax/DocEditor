import { RenderElementProps } from "slate-react";

export const DOC_TOOLBAR_KEY = "doc-toolbar";

export type DocToolBarState = {
  element: RenderElementProps["element"];
  status: {
    isInCodeBlock: boolean;
  };
  close: () => void;
};

export type DocToolbarPlugin = {
  icon: (state: DocToolBarState) => JSX.Element | null;
  menu: (state: DocToolBarState) => JSX.Element | null;
  banner: (state: DocToolBarState) => JSX.Element | null;
};
