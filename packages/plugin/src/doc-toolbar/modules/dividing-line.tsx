import { DIVIDING_LINE_KEY } from "../../dividing-line/types";
import { DividingLine } from "../icons/dividing-line";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedSignalMenu } from "../utils/wrapper";

export const DividingLineDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[DIVIDING_LINE_KEY]) {
      return { element: DividingLine };
    }
    return null;
  },
  renderSignal: state => {
    if (state.status.isBlock) return null;
    const onClick = () => {
      exec(state, DIVIDING_LINE_KEY);
      state.close();
    };
    return getWrappedSignalMenu(DividingLine, onClick);
  },
  renderBanner: () => null,
};
