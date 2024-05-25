declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    uuid?: string;
    [IMAGE_KEY]?: {
      status: typeof IMAGE_STATUS[keyof typeof IMAGE_STATUS];
      src: string;
      width?: number | string;
      height?: number | string;
    };
  }
}

export const IMAGE_STATUS = {
  LOADING: 1,
  SUCCESS: 2,
  FAIL: 3,
} as const;

export const IMAGE_KEY = "image";
