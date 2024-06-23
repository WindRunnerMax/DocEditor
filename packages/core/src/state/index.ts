import type { EditorKit } from "../editor/";
import type { StateKey, StateMap } from "./types";

export class State {
  private _state: Partial<StateMap>;
  constructor(private editor: EditorKit) {
    this._state = {};
  }

  public get(key: StateKey): boolean {
    return !!this._state[key];
  }

  public set(key: StateKey, value: boolean) {
    this._state[key] = value;
  }
}
