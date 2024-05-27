import type { NodeEntry, Range, RenderElementProps, RenderLeafProps } from "doc-editor-delta";

export type ApplyPlugins = {
  renderBlock: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => unknown;
  decorate: (entry: NodeEntry) => Range[];
};
