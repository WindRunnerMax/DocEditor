import type { RenderElementProps, RenderLeafProps } from "doc-editor-delta";

type BaseContext = {
  classList: string[];
  children: JSX.Element;
  style: React.CSSProperties;
};

export type BlockContext = BaseContext & {
  element: RenderElementProps["element"];
  props: RenderElementProps;
};

export type LeafContext = BaseContext & {
  element: RenderLeafProps["text"];
  // 需要配合`decorate`使用
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/text.tsx#L39
  leaf: RenderLeafProps["leaf"];
  props: RenderLeafProps;
};
