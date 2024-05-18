import type { BaseEditor } from "slate";

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

export interface TextBlockElement {
  children: TextElement[];
  [key: string]: unknown;
}

export type BaseElement = BlockElement | TextElement;
export type BaseNode = BlockElement | TextElement | TextBlockElement;
