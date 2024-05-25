declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    uuid?: string;
    [FLOW_CHART_KEY]?: {
      type: "xml";
      content: string;
    };
  }
}

export const FLOW_CHART_KEY = "flow-chart";
