import { SlateSchema } from "src/core/schema";
import { DIVIDING_LINE_KEY } from "src/plugins/dividing-line";
import { FLOW_CHART_KEY } from "src/plugins/flow-chart";
import { IMAGE_KEY } from "src/plugins/image";

export const schema: SlateSchema = {
  [IMAGE_KEY]: {
    isVoid: true,
  },
  [DIVIDING_LINE_KEY]: {
    isVoid: true,
  },
  [FLOW_CHART_KEY]: {
    isVoid: true,
  },
};
