import { SlateSchema } from "src/core/schema";
import { dividingLineKey } from "src/plugins/dividing-line";
import { imageKey } from "src/plugins/image";

export const schema: SlateSchema = {
  [imageKey]: {
    isVoid: true,
  },
  [dividingLineKey]: {
    isVoid: true,
  },
};
