import { TextIcon } from "../icons/text";
import { DocToolbarPlugin } from "../types";
import { getWrappedSignalMenu } from "../utils/wrapper";

export const TextDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: () => null,
  renderMenu: state => {
    if (state.status.isBlock) return null;
    const onClick = () => {
      console.log("Object.keys(state.element)", Object.keys(state.element));
    };
    return getWrappedSignalMenu(TextIcon, onClick);
  },
  renderBanner: () => null,
};
