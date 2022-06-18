import "./index.scss";
import { v4 as uuid } from "uuid";
import ReactDOM from "react-dom";

export class Popup {
  private id: string;
  private container: HTMLDivElement | null;
  private mask: HTMLDivElement | null;
  private node: HTMLDivElement | null;
  constructor() {
    this.id = uuid();
    this.container = document.createElement("div");
    this.container.id = this.id;
    this.container.className = "popup-container";

    this.mask = document.createElement("div");
    this.container.appendChild(this.mask);
    this.mask.className = "popup-container-mask";

    this.node = document.createElement("div");
    this.container.appendChild(this.node);
    this.node.className = "popup-container-node";

    document.body.appendChild(this.container);
  }

  public mount(node: JSX.Element) {
    if (!this.node) return void 0;
    ReactDOM.render(node, this.node);
  }

  public onMaskClick(fn: () => unknown) {
    if (!this.mask) return void 0;
    this.mask.onclick = () => {
      fn();
      this.destroy();
    };
  }

  public close() {
    if (!this.node) return void 0;
    ReactDOM.unmountComponentAtNode(this.node);
  }

  public destroy() {
    this.close();
    if (this.node && this.container && this.mask) {
      this.container.removeChild(this.mask);
      this.container.removeChild(this.node);
      document.body.removeChild(this.container);
    }
    this.container = this.mask = this.node = null;
  }
}
