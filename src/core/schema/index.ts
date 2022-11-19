import { Editor } from "slate";

type SchemaItem = {
  isVoid: boolean;
};
export type SlateSchema = Record<string, SchemaItem>;

export const withSchema = <T extends Editor>(schema: SlateSchema, editor: T): T => {
  const { isVoid } = editor;
  const voidKeys: string[] = [];
  for (const [key, value] of Object.entries(schema)) {
    if (value.isVoid) voidKeys.push(key);
  }

  editor.isVoid = element => {
    for (const key of voidKeys) {
      if (element[key]) return true;
    }
    return isVoid(element);
  };

  return editor;
};
