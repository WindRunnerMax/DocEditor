import type { Editor } from "doc-editor-delta";
import type { HistoryEditor } from "doc-editor-delta";
import type { ReactEditor } from "doc-editor-delta";

export type EditorSuite = Editor & HistoryEditor & ReactEditor;
