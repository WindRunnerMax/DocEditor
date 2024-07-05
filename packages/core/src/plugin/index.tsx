import { DEFAULT_PRIORITY } from "doc-editor-utils";

import type { EditorKit } from "../editor/";
import type { BlockPlugin, EditorPlugin, LeafPlugin } from "./modules/declare";
import { decorate, renderBlock, renderLeaf } from "./modules/render";
import type { ApplyPlugins } from "./types/apply";
import { EDITOR_ELEMENT_TYPE } from "./types/constant";
import { KEY_EVENT } from "./types/constant";

export class PluginController {
  public blocks: BlockPlugin[];
  public leaves: LeafPlugin[];
  public current: EditorPlugin[];
  private pluginMap: Record<string, EditorPlugin>;

  constructor(private editor: EditorKit) {
    this.pluginMap = {};
    this.current = [];
    this.blocks = [];
    this.leaves = [];
  }

  public register = (...plugins: EditorPlugin[]) => {
    for (const plugin of plugins) {
      const key = plugin.key;
      const exist = this.pluginMap[key];
      exist && exist.destroy && exist.destroy();
      this.pluginMap[key] = plugin;
    }
  };

  public apply = (): ApplyPlugins => {
    const plugins = Object.values(this.pluginMap);
    const blockPlugins: BlockPlugin[] = [];
    const leafPlugins: LeafPlugin[] = [];
    const keyDownPlugins: EditorPlugin[] = [];
    const decoratePlugins: EditorPlugin[] = [];
    plugins.sort((a, b) => (b.priority || DEFAULT_PRIORITY) - (a.priority || DEFAULT_PRIORITY));
    plugins.forEach(item => {
      if (item.type === EDITOR_ELEMENT_TYPE.BLOCK) {
        blockPlugins.push(item);
        if (item.WITH_LEAF_PLUGINS) {
          leafPlugins.push(...item.WITH_LEAF_PLUGINS);
        }
      } else if (item.type === EDITOR_ELEMENT_TYPE.INLINE) {
        leafPlugins.push(item);
      }
      item.onCommand && this.editor.command.register(item.key, item.onCommand);
      item.onKeyDown && keyDownPlugins.push(item);
      item.onDecorate && decoratePlugins.push(item);
    });
    this.blocks = blockPlugins;
    this.leaves = leafPlugins;

    return {
      renderBlock: props => {
        return renderBlock(props, blockPlugins);
      },
      renderLeaf: props => {
        return renderLeaf(props, leafPlugins);
      },
      onKeyDown: event => {
        // TODO: 键盘事件由`Event`模块统一处理
        if (event.nativeEvent.isComposing) return void 0;
        for (const item of keyDownPlugins) {
          // 返回`STOP`则停止继续执行
          if (item.onKeyDown && item.onKeyDown(event) === KEY_EVENT.STOP) break;
        }
        return void 0;
      },
      decorate: entry => {
        return decorate(entry, decoratePlugins);
      },
    };
  };

  public reset = () => {
    const plugins = Object.values(this.pluginMap);
    plugins.forEach(node => node.destroy && node.destroy());
    this.pluginMap = {};
  };

  public destroy = () => {
    this.reset();
  };
}
