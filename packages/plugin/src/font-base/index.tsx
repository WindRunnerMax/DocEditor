import "./styles/index.scss";

import type { CommandFn, EditorKit, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { assertValue } from "doc-editor-utils";
import { setTextNode } from "doc-editor-utils";

import { Popup } from "../shared/modules/popup";
import { FontBaseMenu } from "./components/menu";
import type { FontBaseConfig } from "./types";
import { FONT_BASE_KEY } from "./types";

export class FontBasePlugin extends LeafPlugin {
  public key: string = FONT_BASE_KEY;
  private popupModel: Popup | null = null;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[FONT_BASE_KEY];
  }

  public onCommand: CommandFn = data => {
    if (data && data.position && data.marks && !this.popupModel) {
      const config: FontBaseConfig = data.marks[FONT_BASE_KEY] || {};
      const position = data.position;
      return new Promise<void>(resolve => {
        const model = new Popup();
        this.popupModel = model;
        model.onBeforeDestroy(() => {
          this.popupModel = null;
          resolve();
        });
        model.mount(
          <FontBaseMenu
            config={config}
            left={position.left}
            top={position.top}
            onChange={value => {
              setTextNode(this.editor.raw, { [this.key]: value });
            }}
          />
        );
      }).catch(() => void 0);
    } else if (this.popupModel) {
      this.popupModel.destroy();
      this.popupModel = null;
    }
  };

  public render(context: LeafContext): JSX.Element {
    const config = assertValue(context.props.leaf[FONT_BASE_KEY]);
    context.style = { ...context.style, ...config };
    return context.children;
  }
}
