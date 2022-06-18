import { Editor } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { CommandFn, registerCommand } from "./commands";

type BasePlugin = {
  key: string;
  isVoid?: boolean;
  priority?: number; // 优先级越高 在越外层
  command?: CommandFn;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean | void;
};
type ElementPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.BLOCK;
  match: (props: RenderElementProps) => boolean;
  renderLine?: (context: ElementContext) => JSX.Element;
  render?: (context: ElementContext) => JSX.Element;
};
type LeafPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.INLINE;
  match: (props: RenderLeafProps) => boolean;
  render?: (context: LeafContext) => JSX.Element;
};

export type Plugin = ElementPlugin | LeafPlugin;
export const EDITOR_ELEMENT_TYPE = {
  BLOCK: "BLOCK" as const,
  INLINE: "INLINE" as const,
};
export type ElementContext = {
  classList: string[];
  element: RenderElementProps["element"];
  children: JSX.Element;
  props: RenderElementProps;
};
export type LeafContext = {
  classList: string[];
  children: JSX.Element;
  element: RenderLeafProps["text"];
  props: RenderLeafProps;
};

type RenderPlugins = {
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => unknown;
  withVoidElements: (editor: Editor) => Editor;
};
export const createPlugins = (...plugins: Plugin[]): RenderPlugins => {
  const elementPlugins: ElementPlugin[] = [];
  const leafPlugins: LeafPlugin[] = [];
  const voidKeys: string[] = [];
  plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  plugins.forEach(item => {
    if (item.type === EDITOR_ELEMENT_TYPE.BLOCK) elementPlugins.push(item);
    else if (item.type === EDITOR_ELEMENT_TYPE.INLINE) leafPlugins.push(item);
    item.command && registerCommand(item.key, item.command);
    if (item.isVoid) voidKeys.push(item.key);
  });

  const renderPlugins: RenderPlugins = {
    renderElement: props => {
      const context: ElementContext = {
        props,
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
        <div {...props.attributes} className={context.classList.join(" ")}>
          {context.children}
        </div>
      );
    },
    renderLeaf: props => {
      const context: LeafContext = {
        props,
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
        <span {...props.attributes} className={context.classList.join(" ")}>
          {context.children}
        </span>
      );
    },
    onKeyDown: event => {
      if (event.nativeEvent.isComposing) return void 0;
      for (const item of plugins) {
        if (item.onKeyDown && item.onKeyDown(event)) break; // 返回`true`则停止继续执行
      }
    },
    withVoidElements: editor => {
      const { isVoid } = editor;
      editor.isVoid = element => {
        for (const key of voidKeys) {
          if (element[key]) return true;
        }
        return isVoid(element);
      };
      return editor;
    },
  };
  return renderPlugins;
};
