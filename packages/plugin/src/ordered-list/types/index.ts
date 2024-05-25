declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [ORDERED_LIST_KEY]?: boolean;
    [ORDERED_LIST_ITEM_KEY]?: OrderListItemConfig;
  }
}

export type OrderListItemConfig = {
  start: number;
  level: number;
};

export const ORDERED_LIST_KEY = "ordered-list";
export const ORDERED_LIST_ITEM_KEY = "ordered-list-item";
