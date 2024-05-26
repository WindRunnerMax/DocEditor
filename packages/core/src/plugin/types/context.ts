import type { RenderElementProps, RenderLeafProps } from "doc-editor-delta";

export type BlockProps = RenderElementProps;
export type LeafProps = RenderLeafProps;

type BaseContext = {
  classList: string[];
  children: JSX.Element;
  style: React.CSSProperties;
};

export type BlockContext = BaseContext & {
  element: BlockProps["element"];
  props: BlockProps;
};

export type LeafContext = BaseContext & {
  element: LeafProps["text"];
  // 需要配合`decorate`使用
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/text.tsx#L39
  leaf: LeafProps["leaf"];
  props: LeafProps;
};
