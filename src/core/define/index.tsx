import { Descendant, Node } from "slate";
import { registerCommand, SlateCommands } from "./commands";
import { isBlock, isText, isTextBlock } from "../ops/is";
import {
  ElementPlugin,
  LeafPlugin,
  RenderPlugins,
  Plugin,
  ElementContext,
  LeafContext,
  EDITOR_ELEMENT_TYPE,
  KEY_EVENT,
} from "./interface";

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
      onCopy: (event, editor) => {
        const fragments = editor.getFragment();
        const parseText = (fragment: Descendant[]): string => {
          return fragment
            .map(item => {
              if (isText(item)) return Node.string(item);
              else if (isTextBlock(editor, item)) return parseText(item.children) + "\n";
              else if (isBlock(editor, item)) return parseText(item.children);
              else return "";
            })
            .join("");
        };
        const text = parseText(fragments).replace(/\n$/, "");
        event.clipboardData.setData("text/plain", text);
        event.preventDefault();
      },
    };
  };
}
