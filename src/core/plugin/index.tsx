import { registerCommand, SlateCommands } from "../command";
import { onCopy, onKeyDown } from "./event";
import { ElementPlugin, LeafPlugin, RenderPlugins, Plugin, EDITOR_ELEMENT_TYPE } from "./interface";
import { renderElement, renderLeaf } from "./render";

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
    const keyDownPlugins: Plugin[] = [];
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    this.plugins.forEach(item => {
      if (item.type === EDITOR_ELEMENT_TYPE.BLOCK) elementPlugins.push(item);
      else if (item.type === EDITOR_ELEMENT_TYPE.INLINE) leafPlugins.push(item);
      item.command && registerCommand(item.key, item.command, this.commands);
      item.onKeyDown && keyDownPlugins.push(item);
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
      commands: this.commands,
      onCopy: (event, editor) => {
        return onCopy(event, editor);
      },
    };
  };
}
