import { SlateSchema } from "src/core/schema";
import { DIVIDING_LINE_KEY } from "src/plugins/dividing-line";
import { IMAGE_KEY } from "src/plugins/image";

export const schema: SlateSchema = {
  [IMAGE_KEY]: {
    isVoid: true,
  },
  [DIVIDING_LINE_KEY]: {
    isVoid: true,
  },
};
