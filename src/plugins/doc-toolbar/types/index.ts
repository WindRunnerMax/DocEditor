import { TriggerProps } from "@arco-design/web-react/es/Trigger/interface";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { EditorCommands } from "src/core/command";

export const DOC_TOOLBAR_KEY = "doc-toolbar";

export type DocToolBarState = {
  editor: Editor;
  commands: EditorCommands;
  element: RenderElementProps["element"];
  status: {
    isInCodeBlock: boolean;
  };
  close: () => void;
};

export type DocToolbarPlugin = {
  renderIcon: (
    state: DocToolBarState
  ) => null | { element: JSX.Element; config?: Partial<TriggerProps> };
  renderMenu: (state: DocToolBarState) => JSX.Element | null;
  renderBanner: (state: DocToolBarState) => JSX.Element | null;
};
