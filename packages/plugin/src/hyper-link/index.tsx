import "./styles/index.scss";

import type { CommandFn, EditorKit, LeafContext } from "doc-editor-core";
import { LeafPlugin } from "doc-editor-core";
import type { RenderLeafProps } from "doc-editor-delta";
import { assertValue } from "doc-editor-utils";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { Popup } from "../shared/modules/popup";
import { HyperLinkMenu } from "./components/menu";
import { HyperLinkEditor } from "./components/panel";
import type { HyperLinkConfig } from "./types";
import { HYPER_LINK_KEY } from "./types";

export class HyperLinkPlugin extends LeafPlugin {
  public key: string = HYPER_LINK_KEY;
  private popupModel: Popup | null = null;

  constructor(private editor: EditorKit, private readonly: boolean) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[HYPER_LINK_KEY];
  }

  public onCommand?: CommandFn = data => {
    const key = this.key;
    const editor = this.editor;
    if (data && data.position && data.marks && !this.popupModel) {
      const position = data.position;
      const config: HyperLinkConfig = {
        ...(data.marks[HYPER_LINK_KEY] || { href: "", blank: true }),
      };
      return new Promise<void>(resolve => {
        const model = new Popup();
        this.popupModel = model;
        model.onBeforeDestroy(() => {
          this.popupModel = null;
          resolve();
        });
        model.mount(
          <HyperLinkMenu
            config={config}
            left={position.left}
            top={position.top}
            onConfirm={value => {
              config.href = value.href;
              config.blank = value.blank;
              setTextNode(editor.raw, { [key]: config });
              model.destroy();
            }}
            onCancel={() => {
              setUnTextNode(editor.raw, [key]);
              model.destroy();
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
    const config = assertValue(context.props.leaf[HYPER_LINK_KEY]);
    if (!this.readonly) {
      return (
        <HyperLinkEditor config={config} element={context.element} editor={this.editor}>
          {context.children}
        </HyperLinkEditor>
      );
    } else {
      return (
        <a className="hyper-link" href={config.href} target={config.blank ? "_blank" : void 0}>
          {context.children}
        </a>
      );
    }
  }
}
