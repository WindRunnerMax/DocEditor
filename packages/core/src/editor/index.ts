import type { Editor } from "doc-editor-delta";
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
import { Selection } from "../selection";
import { State } from "../state";
import { Track } from "../track";
import { DEFAULT_OPTIONS } from "./constant";
import type { EditorOptions, EditorRaw } from "./types";

/**
 * 1. 完整封装组件 通过`Editor`重新分发事件
 * 2. 重新设计扁平化数据结构 避免大量层级嵌套
 * 3. 完善状态管理模块 `Blocks`级数据结构管理
 */

export class EditorKit {
  /** 原始对象 */
  public readonly raw: EditorRaw;
  /** 初始化参数 */
  public readonly options: EditorOptions;
  /** 内容更新与选区变换 */
  public readonly do: Do;
  /** 事件监听与分发 */
  public readonly event: Event;
  /** 内部状态 */
  public readonly state: State;
  /** 历史操作与追踪 */
  public readonly track: Track;
  /** 配置模块 */
  public readonly schema: Schema;
  /** 内容节点获取与判断 */
  public readonly reflex: Reflex;
  /** 日志模块 */
  public readonly logger: Logger;
  /** 命令模块 */
  public readonly command: Command;
  /** 剪贴板模块 */
  public readonly clipboard: Clipboard;
  /** 选区模块 */
  public readonly selection: Selection;
  /** 插件化控制器 */
  public readonly plugin: PluginController;

  constructor(config: EditorSchema, options?: Partial<EditorOptions>) {
    const raw = withReact(createEditor() as Editor & ReactEditor);
    const schema = new Schema(config, this);
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.raw = schema.with(this.options.history ? withHistory(raw) : raw);
    this.schema = schema;
    this.logger = new Logger(LOG_LEVEL.ERROR);
    this.reflex = new Reflex(this);
    this.do = new Do(this);
    this.state = new State(this);
    this.event = new Event(this);
    this.clipboard = new Clipboard(this);
    this.track = new Track(this);
    this.selection = new Selection(this);
    this.command = new Command(this);
    this.plugin = new PluginController(this);
  }

  public destroy(): void {
    this.command.destroy();
    this.clipboard.destroy();
    this.plugin.destroy();
    this.track.destroy();
    this.state.destroy();
    this.event.destroy();
  }
}
