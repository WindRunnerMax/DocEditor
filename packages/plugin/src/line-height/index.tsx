import "./styles/index.scss";

import type { BlockContext, CommandFn, EditorKit } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { assertValue } from "doc-editor-utils";
import { getBlockNode } from "doc-editor-utils";
import { setBlockNode } from "doc-editor-utils";

import { Popup } from "../shared/modules/popup";
import { LineHeightMenu } from "./components/menu";
import { LINE_HEIGHT_KEY } from "./types";

export class LineHeightPlugin extends BlockPlugin {
  public key: string = LINE_HEIGHT_KEY;
  private popupModel: Popup | null = null;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[LINE_HEIGHT_KEY];
  }

  public onCommand: CommandFn = data => {
    const key = this.key;
    const editor = this.editor;
    if (data && data.position && !this.popupModel) {
      let config = 1.8;
      const match = getBlockNode(editor.raw, { key: LINE_HEIGHT_KEY });
      if (match) config = assertValue(match.block["line-height"]);
      const position = data.position;
      return new Promise<void>(resolve => {
        const model = new Popup();
        this.popupModel = model;
        model.onBeforeDestroy(() => {
          this.popupModel = null;
          resolve();
        });
        model.mount(
          <LineHeightMenu
            config={config}
            left={position.left}
            top={position.top}
            onChange={value => {
              setBlockNode(editor.raw, { [key]: value });
            }}
          />
        );
      }).catch(() => void 0);
    } else if (this.popupModel) {
      this.popupModel.destroy();
      this.popupModel = null;
    }
  };

  public renderLine(context: BlockContext): JSX.Element {
    const lineHeight = assertValue(context.props.element[LINE_HEIGHT_KEY]);
    return <div style={{ lineHeight }}>{context.children}</div>;
  }
}
