import type { BaseNode, Editor } from "doc-editor-delta";
import type { ReactEditor } from "doc-editor-delta";
import { createEditor } from "doc-editor-delta";
import { withHistory } from "doc-editor-delta";
import { withReact } from "doc-editor-delta";

import { Clipboard } from "../clipboard";
import { Command } from "../command";
import { Do } from "../do";
import { Event } from "../event";
import { LOG_LEVEL, Logger } from "../log";
import { PluginController } from "../plugin";
import { Reflex } from "../reflex";
import { Schema } from "../schema";
import type { EditorSchema } from "../schema/types";
import { State } from "../state";
import { Track } from "../track";
import type { EditorRaw } from "./types";

/**
 * 1. 完整封装组件 通过`Editor`重新分发事件
 * 2. 重新设计数据结构 避免大量层级嵌套 扁平化数据结构
 * 4. 属性与事件全部由`Editor`以套件形式分发
 */

export class EditorKit {
  public readonly raw: EditorRaw;
  public readonly init?: BaseNode[];
  public readonly do: Do;
  public readonly event: Event;
  public readonly state: State;
  public readonly track: Track;
  public readonly schema: Schema;
  public readonly reflex: Reflex;
  public readonly logger: Logger;
  public readonly command: Command;
  public readonly clipboard: Clipboard;
  public readonly plugin: PluginController;

  constructor(config: EditorSchema, init?: BaseNode[]) {
    const raw = withHistory(withReact(createEditor() as Editor & ReactEditor));
    const schema = new Schema(config, raw);
    this.raw = schema.with(raw);
    this.init = init;
    this.schema = schema;
    this.reflex = new Reflex(this);
    this.do = new Do(this);
    this.command = new Command(this);
    this.logger = new Logger(LOG_LEVEL.ERROR);
    this.state = new State(this);
    this.event = new Event(this);
    this.clipboard = new Clipboard(this);
    this.plugin = new PluginController(this);
    this.track = new Track(this);
  }

  public destroy(): void {
    this.command.destroy();
    this.event.destroy();
    this.plugin.destroy();
    this.track.destroy();
  }
}
