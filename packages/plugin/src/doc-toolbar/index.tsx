import "./styles/index.scss";

import type { BlockContext } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import { DEFAULT_PRIORITY } from "doc-editor-utils";

import { DocMenu } from "./components/doc-menu";
import { DOC_TOOLBAR_MODULES } from "./config";
import { DOC_TOOLBAR_KEY } from "./types";

export class DocToolBarPlugin extends BlockPlugin {
  public readonly key = DOC_TOOLBAR_KEY;
  public readonly priority = DEFAULT_PRIORITY + 13;

  constructor(
    private editor: EditorKit,
    private readonly: boolean,
    private plugins = DOC_TOOLBAR_MODULES
  ) {
    super();
  }

  public destroy(): void {}

  public match(): boolean {
    return true;
  }

  public renderLine(context: BlockContext): JSX.Element {
    if (this.readonly) return context.children;
    return (
      <DocMenu editor={this.editor} element={context.element} plugins={this.plugins}>
        {context.children}
      </DocMenu>
    );
  }
}
