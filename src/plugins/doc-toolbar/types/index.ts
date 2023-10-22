import { TriggerProps } from "@arco-design/web-react/es/Trigger/interface";
import { Editor, Path } from "slate";
import { RenderElementProps } from "slate-react";
import { EditorCommands } from "src/core/command";
import { EditorSchema } from "src/core/schema";

export const DOC_TOOLBAR_KEY = "doc-toolbar";

export type DocToolBarState = {
  path: Path;
  editor: Editor;
  schema: EditorSchema;
  commands: EditorCommands;
  element: RenderElementProps["element"];
  status: {
    isBlock: boolean;
    isEmptyLine: boolean;
    isInCodeBlock: boolean;
    isInReactLive: boolean;
    isInHighLightBlock: boolean;
    isNextLine: boolean;
  };
  close: () => void;
};

export type DocToolbarPlugin = {
  renderIcon: (
    state: DocToolBarState
  ) => null | { element: JSX.Element; config?: Partial<TriggerProps> };
  renderSignal: (state: DocToolBarState) => JSX.Element | null;
  renderBanner: (state: DocToolBarState) => JSX.Element | null;
};
