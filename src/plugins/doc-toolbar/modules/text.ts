import { TextIcon } from "../icons/text";
import { DocToolbarPlugin } from "../types";

export const TextDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: () => null,
  renderMenu: () => TextIcon,
  renderBanner: () => null,
};
