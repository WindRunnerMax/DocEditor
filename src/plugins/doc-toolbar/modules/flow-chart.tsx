import { DocToolbarPlugin } from "../types";
import { getWrappedBannerMenu } from "../utils/wrapper";
import { IconPalette } from "@arco-design/web-react/icon";
import { exec } from "../utils/exec";
import { FLOW_CHART_KEY } from "src/plugins/flow-chart/types";

export const FlowChartDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => null,
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
