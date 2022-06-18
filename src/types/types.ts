import { Ancestor, BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type BaseElement = { children: BaseText[] } & Record<string, unknown>;
export type BaseText = { text: string } & Record<string, unknown>;
export type BaseNode = BaseElement | BaseText;
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: BaseElement;
    Text: BaseText;
  }
}

export type ExtendAncestor = Ancestor & Record<string, unknown>;
