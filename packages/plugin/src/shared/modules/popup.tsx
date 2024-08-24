import "../styles/popup.scss";

import { getUniqueId } from "doc-editor-utils";
import ReactDOM from "react-dom";

// 互斥式实例
let instance: Popup | null = null;

type Options = {
  mutex: boolean;
};
export class Popup {
  static BIND_EVENT_NAME = "mousedown";
  private id: string;
  private container: HTMLDivElement | null;
  private node: HTMLDivElement | null;
  private onBeforeCloseFn: () => unknown;

  constructor(options?: Options) {
    const { mutex = true } = options || {};

    this.id = getUniqueId();
    this.container = document.createElement("div");
    this.container.id = this.id;
    this.container.className = "popup-container";
    this.node = document.createElement("div");
    this.node.onmousedown = e => e.stopPropagation();
    this.container.appendChild(this.node);
    this.node.className = "popup-container-node";
    document.body.appendChild(this.container);

    // 互斥实例
    if (mutex) {
      instance && instance.destroy();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      instance = this;
    }
    this.onBeforeCloseFn = () => null;
  }

  public mount = (node: JSX.Element) => {
    if (!this.node) return void 0;
    ReactDOM.render(node, this.node);
  };

  public onBeforeDestroy = (fn: () => unknown) => {
    this.onBeforeCloseFn = fn;
    document.addEventListener(Popup.BIND_EVENT_NAME, this.destroy);
  };

  public destroy = () => {
    this.onBeforeCloseFn();
    document.removeEventListener(Popup.BIND_EVENT_NAME, this.destroy);
    if (this.node && this.container) {
      ReactDOM.unmountComponentAtNode(this.node);
      this.container.removeChild(this.node);
      document.body.removeChild(this.container);
    }
    if (instance === this) instance = null;
    this.container = this.node = null;
  };
}
