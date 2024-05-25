declare module "doc-editor-delta/dist/interface" {
  interface TextElement {
    [FONT_BASE_KEY]?: FontBaseConfig;
  }
}

export type FontBaseConfig = {
  fontSize?: number;
  color?: string;
  background?: string;
};
export const FONT_BASE_KEY = "font-base";
