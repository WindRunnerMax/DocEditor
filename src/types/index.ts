import { BaseEditor, BlockElement, TextElement } from "slate";
import { ReactEditor } from "slate-react";
export type { BlockElement, TextElement } from "slate";

export type BaseNode = BlockElement | TextElement;
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
