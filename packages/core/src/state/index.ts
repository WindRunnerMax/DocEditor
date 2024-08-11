import type { BaseNode } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";

import type { EditorKit } from "../editor/";
import type { EditorRaw } from "../editor/types";
import type { ContentOperation } from "../event/types/bus";
import type { StateKey, StateMap } from "./types";

export class State {
  private raw: EditorRaw;
  private _state: Partial<StateMap>;
  constructor(private editor: EditorKit) {
    this._state = {};
    this.raw = editor.raw;
  }

  public destroy = () => {
    this._state = {};
  };

  public get(key: StateKey): boolean {
    return !!this._state[key];
  }

  public set(key: StateKey, value: boolean) {
    this._state[key] = value;
  }

  public apply(operation: ContentOperation) {
    this.raw.apply(operation);
  }

  public setContent(nodes: BaseNode[]) {
    this.editor.track.clear();
    this.raw.children = nodes;
    this.editor.selection.set(Editor.start(this.raw, []));
    this.editor.selection.focus();
  }
}
