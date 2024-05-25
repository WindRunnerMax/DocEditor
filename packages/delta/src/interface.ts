import type { BaseEditor } from "slate";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: BlockElement;
    Text: TextElement;
  }
}

export interface BlockElement {
  text?: never;
  children: BaseNode[];
  [key: string]: unknown;
}

export interface TextElement {
  text: string;
  children?: never;
  [key: string]: unknown;
}

export interface TextBlockElement extends BlockElement {
  children: TextElement[];
}

export type BaseElement = BlockElement | TextElement;
export type BaseNode = BlockElement | TextElement | TextBlockElement;
