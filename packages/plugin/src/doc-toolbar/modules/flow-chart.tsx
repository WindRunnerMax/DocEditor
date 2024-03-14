import { IconPalette } from "@arco-design/web-react/icon";

import { FLOW_CHART_KEY } from "../../flow-chart/types";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedBannerMenu } from "../utils/wrapper";

export const FlowChartDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[FLOW_CHART_KEY]) {
      return { element: <IconPalette />, config: { position: "lt" } };
    }
    return null;
  },
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine) return null;
    const onClick = () => {
      exec(state, FLOW_CHART_KEY);
      state.close();
    };
    return getWrappedBannerMenu(<IconPalette />, "流程图", onClick);
  },
};
