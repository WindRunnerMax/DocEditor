declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [UNORDERED_LIST_KEY]?: boolean;
    [UNORDERED_LIST_ITEM_KEY]?: UnOrderListItemConfig;
  }
}
export type UnOrderListItemConfig = {
  level: number;
};

export const UNORDERED_LIST_KEY = "unordered-list";
export const UNORDERED_LIST_ITEM_KEY = "unordered-list-item";
