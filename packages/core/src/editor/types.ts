import type { BaseNode, Editor } from "doc-editor-delta";
import type { HistoryEditor } from "doc-editor-delta";
import type { ReactEditor } from "doc-editor-delta";

import type { Clipboard } from "../clipboard";
import type { Command } from "../command";
import type { Event } from "../event";
import type { Logger } from "../log";
import type { EditorPlugin } from "../plugin";

export type EditorKit = EditorSuite;
export type EditorSuite = Editor &
  HistoryEditor &
  ReactEditor & {
    init?: BaseNode[];
    command: Command;
    event: Event;
    clipboard: Clipboard;
    logger: Logger;
    plugin: EditorPlugin;
    destroy: () => void;
  };
