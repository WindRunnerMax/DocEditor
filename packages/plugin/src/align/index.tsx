import "./index.scss";

import type { CommandFn } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { BlockContext } from "doc-editor-core/dist/plugin/types/context";
import type { RenderElementProps } from "doc-editor-delta";
import { isObject } from "doc-editor-utils";
import { isMatchedAttributeNode } from "doc-editor-utils";
import { setBlockNode } from "doc-editor-utils";

import { ALIGN_KEY } from "./types";

export class AlignPlugin extends BlockPlugin {
  public readonly key: string = ALIGN_KEY;

  public destroy(): void {}

  public onCommand: CommandFn = (editor, key, data) => {
    if (isObject(data) && !isMatchedAttributeNode(editor, ALIGN_KEY, data.extraKey)) {
      setBlockNode(editor, { [key]: data.extraKey });
    }
  };

  public match(props: RenderElementProps): boolean {
    return !!props.element[ALIGN_KEY];
  }

  public renderLine(context: BlockContext): JSX.Element {
    const align = context.props.element[ALIGN_KEY];
    if (!align || align === "left") return context.children;
    context.classList.push("align-" + align);
    return context.children;
  }
}
