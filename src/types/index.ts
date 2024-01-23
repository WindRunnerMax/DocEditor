import type { BaseEditor, BlockElement, TextElement, Path } from "slate";
import { Node } from "slate";
import type { ReactEditor } from "slate-react";

declare module "slate" {
  interface BlockElement {
    children: BaseNode[];
    [key: string]: unknown;
  }
  interface TextElement {
    text: string;
    [key: string]: unknown;
  }
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: BlockElement;
    Text: TextElement;
  }
}

export type { BlockElement, TextElement } from "slate";
export type BaseNode = BlockElement | TextElement;
export type EditorPath = Path;
export const EditorNode = Node;
