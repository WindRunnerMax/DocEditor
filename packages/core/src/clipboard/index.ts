import type { BaseNode } from "doc-editor-delta";
import { EVENT_ENUM } from "doc-editor-utils";

import type { EditorKit } from "../editor";
import { EditorModule } from "../editor/inject";
import { EDITOR_EVENT } from "../event/bus/action";

export class Clipboard extends EditorModule {
  constructor(editor: EditorKit) {
    super(editor);
    editor.event.on(EDITOR_EVENT.COPY, this.onCopy);
    editor.event.on(EDITOR_EVENT.CUT, this.onCut);
    editor.event.on(EDITOR_EVENT.PASTE, this.onPaste);
  }

  destroy() {
    this.editor.event.off(EDITOR_EVENT.COPY, this.onCopy);
    this.editor.event.off(EDITOR_EVENT.CUT, this.onCut);
    this.editor.event.off(EDITOR_EVENT.PASTE, this.onPaste);
  }

  public onCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L115
    event.preventDefault();
    const sel = this.editor.selection.get();
    if (!sel) return void 0;
    const tuple = this.reflex.getClosestBlockTuple(sel);
    const nodes: BaseNode[] = [];
    if (sel.isCollapsed()) {
      if (tuple && this.reflex.isVoidNode(tuple.node)) {
        nodes.push(tuple.node);
      }
    } else {
      //
    }
  };

  public onCut = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/editable.tsx#L951
    event.preventDefault();
  };

  public onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L224
    event.preventDefault();
  };

  private writeToClipboard = (data: Record<string, string>) => {
    const textarea = document.createElement("textarea");
    const handler = (event: ClipboardEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      for (const [key, value] of Object.entries(data)) {
        event.clipboardData && event.clipboardData.setData(key, value);
      }
    };
    textarea.addEventListener(EVENT_ENUM.COPY, handler, true);
    textarea.style.position = "fixed";
    textarea.style.left = "-999999999px";
    textarea.style.top = "-999999999px";
    textarea.value = " ";
    // COMPAT: `safari`需要挂载在`DOM`上才能触发
    // `ipad`则需要挂载在内部`DOM`容器才能执行 暂不处理
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand(EVENT_ENUM.COPY);
    textarea.removeEventListener(EVENT_ENUM.COPY, handler);
    document.body.removeChild(textarea);
  };
}
