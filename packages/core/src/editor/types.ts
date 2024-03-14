import type { Editor } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

export type EditorSuite = Editor & HistoryEditor & ReactEditor;
