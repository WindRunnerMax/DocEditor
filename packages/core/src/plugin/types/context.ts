import type { RenderElementProps, RenderLeafProps } from "doc-editor-delta";

export type BlockProps = RenderElementProps;
export type LeafProps = RenderLeafProps;

type BaseContext = {
  classList: string[];
  children: JSX.Element;
  style: React.CSSProperties;
};

export type BlockContext = BaseContext & {
  /** 停止匹配插件 */
  stop: boolean;
  /** 以返回值作为匹配结果 */
  plain: boolean;
  props: BlockProps;
  element: BlockProps["element"];
};

export type LeafContext = BaseContext & {
  props: LeafProps;
  /** 需要配合`decorate`使用  */
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/text.tsx#L39
  leaf: LeafProps["leaf"];
  element: LeafProps["text"];
};
