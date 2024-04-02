import type { BaseNode, Editor } from "doc-editor-delta";
import type { ReactEditor } from "doc-editor-delta";
import { createEditor } from "doc-editor-delta";
import { withHistory } from "doc-editor-delta";
import { withReact } from "doc-editor-delta";

import { Clipboard } from "../clipboard";
import { Command } from "../command";
import { Event } from "../event";
import { EDITOR_EVENT } from "../event/modules/action";
import { LOG_LEVEL, Logger } from "../log";
import { EditorPlugin } from "../plugin";
import type { EditorSchema } from "../schema";
import { withSchema } from "../schema";
import type { EditorSuite } from "./types";

/**
 * 1. 完整封装组件 通过`Editor`重新分发事件
 * 2. 重新设计数据结构 避免大量层级嵌套 扁平化数据结构
 * 3. 增加状态管理 `Blocks`级数据结构管理
 */

export function makeEditor(schema: EditorSchema, init?: BaseNode[]) {
  const editor = withHistory(withReact(createEditor() as Editor & ReactEditor));
  const engine = withSchema(schema, editor) as EditorSuite;

  engine.init = init;
  engine.command = new Command(engine);
  engine.logger = new Logger(LOG_LEVEL.ERROR);
  engine.event = new Event(engine);
  engine.clipboard = new Clipboard(engine);
  engine.plugin = new EditorPlugin(engine);

  engine.apply = event => {
    if (event.type === "set_selection") {
      engine.event.trigger(EDITOR_EVENT.SELECTION_CHANGE, {
        previous: event.properties,
        current: event.newProperties,
      });
    } else {
      engine.event.trigger(EDITOR_EVENT.CONTENT_CHANGE, {
        changes: event,
      });
    }
  };
  engine.destroy = () => {
    engine.command.destroy();
  };

  return engine;
}
