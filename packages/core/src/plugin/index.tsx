import type { EditorCommands } from "../command";
import { registerCommand } from "../command";
import { onCopy, onKeyDown } from "../event";
import { decorate, renderElement, renderLeaf } from "./render";
import type { ElementPlugin, LeafPlugin, Plugin, RenderPlugins } from "./types";
import { EDITOR_ELEMENT_TYPE } from "./types";

export class EditorPlugin {
  private plugins: Plugin[];
  private commands: EditorCommands;

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
      item.command && registerCommand(item.key, item.command, this.commands);
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
        return onKeyDown(event, keyDownPlugins);
      },
      decorate: entry => {
        return decorate(entry, decoratePlugins);
      },
      commands: this.commands,
      onCopy: (event, editor) => {
        return onCopy(event, editor);
      },
    };
  };
}
