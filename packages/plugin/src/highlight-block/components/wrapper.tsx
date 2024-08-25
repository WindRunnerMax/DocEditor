import { Button, Trigger } from "@arco-design/web-react";
import { IconPalette } from "@arco-design/web-react/icon";
import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import type { AssertT } from "doc-editor-utils";
import { setBlockNode } from "doc-editor-utils";
import type { FC } from "react";
import { useMemo } from "react";

import { useMemoFn } from "../../shared/hooks/preset";
import { HIGHLIGHT_BLOCK_KEY } from "../types";
import { COLOR_MAP } from "../types";

export const HighlightBlockWrapper: FC<{
  editor: EditorKit;
  element: BlockElement;
  config: AssertT<BlockElement["highlight-block"]>;
  readonly: boolean;
}> = props => {
  const { editor, element, config, readonly } = props;

  const switchAction = useMemoFn((index: number) => {
    const path = ReactEditor.findPath(editor.raw, element);
    setBlockNode(
      editor.raw,
      { [HIGHLIGHT_BLOCK_KEY]: COLOR_MAP[index] },
      { at: path, key: HIGHLIGHT_BLOCK_KEY }
    );
  });

  const Selector = useMemo(() => {
    return (
      <div className="highlight-block-selector">
        {COLOR_MAP.map((item, index) => (
          <div
            key={index}
            className="selector-item"
            onClick={() => switchAction(index)}
            style={{
              borderColor: `rgba(${item.border}, 0.7)`,
              backgroundColor: `rgba(${item.background}, 0.3)`,
            }}
          ></div>
        ))}
      </div>
    );
  }, [switchAction]);

  const ButtonGroup = (
    <div onClick={e => e.stopPropagation()} onMouseDown={e => e.preventDefault()}>
      <Trigger trigger="click" popup={() => Selector} popupAlign={{ bottom: 10 }}>
        <Button type="text" icon={<IconPalette />} size="small">
          主题
        </Button>
      </Trigger>
    </div>
  );

  const wrapper = (
    <div
      className="doc-highlight-block"
      style={{
        borderColor: `rgba(${config.border}, 0.7)`,
        backgroundColor: `rgba(${config.background}, 0.3)`,
      }}
    >
      {props.children}
    </div>
  );

  return readonly ? (
    wrapper
  ) : (
    <Trigger
      position="top"
      popup={() => ButtonGroup}
      popupAlign={{ top: 3 }}
      className="hl-block-toolbar"
    >
      {wrapper}
    </Trigger>
  );
};
