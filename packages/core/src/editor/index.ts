import { Editor } from "slate";

export function makeEditor() {
  const editor = new SlateEditor();
  console.log("editor :>> ", editor);
}

const e = new EditorSuite();
console.log("e :>> ", e);
