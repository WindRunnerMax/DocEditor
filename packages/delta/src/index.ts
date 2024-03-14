import type { BaseEditor, BaseRange, Location, Path } from "slate";
import { Editor, Element, Point, Range, Text, Transforms } from "slate";
import { Node } from "slate";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: BlockElement;
    Text: TextElement;
  }
}

export interface BlockElement {
  children: BaseNode[];
  [key: string]: unknown;
}

export interface TextElement {
  text: string;
  [key: string]: unknown;
}

export type BaseNode = BlockElement | TextElement;
export type EditorPath = Path;
export const EditorNode = Node;
export { BaseRange, Editor, Element, Location, Node, Path, Point, Range, Text, Transforms };
