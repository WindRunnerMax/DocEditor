import type { EditorKit } from "./index";

export abstract class EditorModule {
  constructor(protected editor: EditorKit) {
    // COMPAT: 如果在初始化时直接赋值 则会导致模块无法完全初始化
    // 由于实例化顺序问题会导致某些模块处于`undefined`状态并持久化
    // 即使初始化之前不会依赖这些模块 但是在初始化过后调度时则无法调用
  }

  protected get raw() {
    return this.editor.raw;
  }

  protected get do() {
    return this.editor.do;
  }

  protected get event() {
    return this.editor.event;
  }

  protected get state() {
    return this.editor.state;
  }

  protected get track() {
    return this.editor.track;
  }

  protected get schema() {
    return this.editor.schema;
  }

  protected get reflex() {
    return this.editor.reflex;
  }

  protected get logger() {
    return this.editor.logger;
  }

  protected get command() {
    return this.editor.command;
  }

  protected get clipboard() {
    return this.editor.clipboard;
  }

  protected get selection() {
    return this.editor.selection;
  }

  protected get plugin() {
    return this.editor.plugin;
  }
}
