import "./styles/index.scss";

import type { CommandFn, EditorKit } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { existKey } from "doc-editor-utils";

import { DividingLine } from "./components/dividing";
import { DIVIDING_LINE_KEY } from "./types";

export class DividingLinePlugin extends BlockPlugin {
  public key: string = DIVIDING_LINE_KEY;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return existKey(props.element, DIVIDING_LINE_KEY);
  }

  public render(): JSX.Element {
    return <DividingLine></DividingLine>;
  }

  public onCommand?: CommandFn = () => {
    const key = this.key;
    const editor = this.editor;
    Transforms.insertNodes(editor.raw, { [key]: true, children: [{ text: "" }] });
    Transforms.insertNodes(editor.raw, { children: [{ text: "" }] });
  };
}
