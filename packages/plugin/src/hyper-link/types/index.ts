declare module "doc-editor-delta/dist/interface" {
  interface TextElement {
    [HYPER_LINK_KEY]?: HyperLinkConfig;
  }
}
export type HyperLinkConfig = {
  href: string;
  blank: boolean;
};

export const HYPER_LINK_KEY = "link";
