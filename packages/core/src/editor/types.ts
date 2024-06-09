import type { BaseNode, Editor } from "doc-editor-delta";
import type { HistoryEditor } from "doc-editor-delta";
import type { ReactEditor } from "doc-editor-delta";

import type { Clipboard } from "../clipboard";
import type { Command } from "../command";
import type { Event } from "../event";
import type { Logger } from "../log";
import type { PluginController } from "../plugin";
import type { Reflex } from "../reflex";
import type { Schema } from "../schema";

export type EditorKit = EditorSuite;
export type EditorSuite = Editor &
  HistoryEditor &
  ReactEditor & {
    init?: BaseNode[];
    schema: Schema;
    reflex: Reflex;
    command: Command;
    event: Event;
    clipboard: Clipboard;
    logger: Logger;
    plugin: PluginController;
    destroy: () => void;
  };
