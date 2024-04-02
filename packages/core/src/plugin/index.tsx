import type { EditorSuite } from "../editor/types";
import { decorate, renderElement, renderLeaf } from "./render";
import type { ElementPlugin, LeafPlugin, Plugin, RenderPlugins } from "./types";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT } from "./types";

export class EditorPlugin {
  private plugins: Plugin[];

  constructor(private editor: EditorSuite) {
    this.plugins = [];
  }

  register = (...plugins: Plugin[]) => {
    this.plugins.push(...plugins);
  };

  apply = (): RenderPlugins => {
    const elementPlugins: ElementPlugin[] = [];
    const leafPlugins: LeafPlugin[] = [];
    const keyDownPlugins: Plugin[] = [];
    const decoratePlugins: Plugin[] = [];
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    this.plugins.forEach(item => {
      if (item.type === EDITOR_ELEMENT_TYPE.BLOCK) {
        elementPlugins.push(item);
        if (item.renderLeaf && item.matchLeaf) {
          leafPlugins.push({
            type: EDITOR_ELEMENT_TYPE.INLINE,
            key: item.key,
            match: item.matchLeaf,
            render: item.renderLeaf,
          });
        }
      } else if (item.type === EDITOR_ELEMENT_TYPE.INLINE) {
        leafPlugins.push(item);
      }
      item.command && this.editor.command.register(item.key, item.command);
      item.onKeyDown && keyDownPlugins.push(item);
      item.decorate && decoratePlugins.push(item);
    });

    return {
      renderElement: props => {
        return renderElement(props, elementPlugins);
      },
      renderLeaf: props => {
        return renderLeaf(props, leafPlugins);
      },
      onKeyDown: event => {
        // TODO: 键盘事件由`Event`模块统一处理
        if (event.nativeEvent.isComposing) return false;
        for (const item of keyDownPlugins) {
          // 返回`STOP`则停止继续执行
          if (item.onKeyDown && item.onKeyDown(event) === KEY_EVENT.STOP) break;
        }
        return true;
      },
      decorate: entry => {
        return decorate(entry, decoratePlugins);
      },
    };
  };
}
