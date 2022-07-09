import { Editor } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { CommandFn, registerCommand, SlateCommands } from "./slate-commands";

type BasePlugin = {
  key: string;
  isVoid?: boolean;
  priority?: number; // 优先级越高 在越外层
  command?: CommandFn;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean | void;
};
export type ElementPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.BLOCK;
  match: (props: RenderElementProps) => boolean;
  renderLine?: (context: ElementContext) => JSX.Element;
  render?: (context: ElementContext) => JSX.Element;
};
export type LeafPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.INLINE;
  match: (props: RenderLeafProps) => boolean;
  render?: (context: LeafContext) => JSX.Element;
};

export type Plugin = ElementPlugin | LeafPlugin;
export const EDITOR_ELEMENT_TYPE = {
  BLOCK: "BLOCK" as const,
  INLINE: "INLINE" as const,
};

type BaseContext = {
  classList: string[];
  children: JSX.Element;
  style: React.CSSProperties;
};
export type ElementContext = BaseContext & {
  element: RenderElementProps["element"];
  props: RenderElementProps;
};
export type LeafContext = BaseContext & {
  element: RenderLeafProps["text"];
  props: RenderLeafProps;
};

type RenderPlugins = {
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => unknown;
  withVoidElements: (editor: Editor) => Editor;
  commands: SlateCommands;
};

export const KEY_EVENT = {
  STOP: true,
};
export class SlatePlugins {
  private plugins: Plugin[];
  private commands: SlateCommands;

  constructor(...plugins: Plugin[]) {
    this.plugins = plugins;
    this.commands = {};
  }

  add = (...plugins: Plugin[]) => {
    this.plugins.push(...plugins);
  };

  getCommands = () => {
    return this.commands;
  };

  apply = (): RenderPlugins => {
    const elementPlugins: ElementPlugin[] = [];
    const leafPlugins: LeafPlugin[] = [];
    const voidKeys: string[] = [];
    const keyDownPlugins: Plugin[] = [];
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    this.plugins.forEach(item => {
      if (item.type === EDITOR_ELEMENT_TYPE.BLOCK) elementPlugins.push(item);
      else if (item.type === EDITOR_ELEMENT_TYPE.INLINE) leafPlugins.push(item);
      item.command && registerCommand(item.key, item.command, this.commands);
      item.isVoid && voidKeys.push(item.key);
      item.onKeyDown && keyDownPlugins.push(item);
    });

    return {
      renderElement: props => {
        const context: ElementContext = {
          props,
          style: {},
          classList: [],
          element: props.element,
          children: props.children,
        };
        for (const item of elementPlugins) {
          if (item.match(props) && item.render) {
            context.children = (
              <>
                {props.children}
                <div contentEditable={false}>{item.render(context)}</div>
              </>
            );
            break;
          }
        }
        for (let i = elementPlugins.length - 1; i >= 0; i--) {
          const item = elementPlugins[i];
          if (item.match(props) && item.renderLine) {
            context.children = item.renderLine(context);
          }
        }
        return (
          <div {...props.attributes} className={context.classList.join(" ")} style={context.style}>
            {context.children}
          </div>
        );
      },
      renderLeaf: props => {
        const context: LeafContext = {
          props,
          style: {},
          element: props.text,
          classList: [],
          children: props.children,
        };
        for (const item of leafPlugins) {
          if (item.match(props) && item.render) {
            context.children = item.render(context);
          }
        }
        return (
          <span {...props.attributes} className={context.classList.join(" ")} style={context.style}>
            {context.children}
          </span>
        );
      },
      onKeyDown: event => {
        if (event.nativeEvent.isComposing) return void 0;
        for (const item of keyDownPlugins) {
          if (item.onKeyDown && item.onKeyDown(event) === KEY_EVENT.STOP) break; // 返回`STOP`则停止继续执行
        }
      },
      withVoidElements: editor => {
        editor.isVoid = element => {
          for (const key of voidKeys) {
            if (element[key]) return true;
          }
          return false;
        };
        return editor;
      },
      commands: this.commands,
    };
  };
}
