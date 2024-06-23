import type { Path } from "slate";
import { Node } from "slate";

import type { BaseNode as BaseElement, BlockElement, TextElement } from "./interface";

export type {
  BaseElement,
  BaseNode,
  BlockElement,
  TextBlockElement,
  TextElement,
} from "./interface";
export type EditorPath = Path;
export const EditorNode = Node;
export type { BaseRange, NodeEntry } from "slate";
export type {
  BaseOperation,
  NodeOperation,
  Operation,
  SetNodeOperation,
  SetSelectionOperation,
  TextOperation,
} from "slate";
export type { Selection } from "slate";
export {
  createEditor,
  Editor,
  Element,
  Location,
  Node,
  Path,
  PathRef,
  Point,
  PointRef,
  Range,
  RangeRef,
  Text,
  Transforms,
} from "slate";
export { HistoryEditor, withHistory } from "slate-history";
export type { RenderElementProps, RenderLeafProps } from "slate-react";
export {
  Editable,
  Slate as EditorProvider,
  ReactEditor,
  useFocused,
  useReadOnly,
  useSelected,
  useSlate,
  useSlateSelector,
  useSlateStatic,
  withReact,
} from "slate-react";

export type NodeTuple = { node: BaseElement; path: Path };
export type TextNodeTuple = { node: TextElement; path: Path };
export type BlockNodeTuple = { node: BlockElement; path: Path };
