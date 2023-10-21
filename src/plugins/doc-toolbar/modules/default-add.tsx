import { IconPlus } from "@arco-design/web-react/icon";
import { DocToolbarPlugin } from "../types";

export const DefaultAddDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: () => {
    return { element: <IconPlus /> };
  },
  renderMenu: () => null,
  renderBanner: () => null,
};
