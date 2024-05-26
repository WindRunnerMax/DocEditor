import type { RenderElementProps, RenderLeafProps } from "doc-editor-delta";
import type { NodeEntry, Range } from "doc-editor-delta";

import type { CommandFn } from "../../command/types";
import { EDITOR_ELEMENT_TYPE } from "../types/constant";
import type { BlockContext, LeafContext } from "../types/context";

abstract class BasePlugin {
  public abstract readonly key: string;
  public abstract readonly type: keyof typeof EDITOR_ELEMENT_TYPE;
  public readonly priority?: number; // 优先级越高 在越外层
  public abstract destroy(): void;
  public onCommand?: CommandFn;
  public onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): boolean | void;
  public onDecorate?(entry: NodeEntry): Range[];
}

export abstract class BlockPlugin extends BasePlugin {
  public readonly type = EDITOR_ELEMENT_TYPE.BLOCK;
  public abstract match(props: RenderElementProps): boolean;
  public renderLine?(context: BlockContext): JSX.Element;
  public render?(context: BlockContext): JSX.Element;
  public matchLeaf?(props: RenderLeafProps): boolean;
  public renderLeaf?(context: LeafContext): JSX.Element;
}

export abstract class LeafPlugin extends BasePlugin {
  public readonly type = EDITOR_ELEMENT_TYPE.INLINE;
  public abstract match(props: RenderLeafProps): boolean;
  public render?(context: LeafContext): JSX.Element;
}

export type EditorPlugin = BlockPlugin | LeafPlugin;
