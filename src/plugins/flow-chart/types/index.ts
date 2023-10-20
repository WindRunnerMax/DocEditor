declare module "slate" {
  interface BlockElement {
    uuid?: string;
    [FLOW_CHART_KEY]?: {
      type: "xml";
      content: string;
    };
  }
}

export const FLOW_CHART_KEY = "flow-chart";
