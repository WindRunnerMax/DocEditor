import "../index.scss";

import { Trigger } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import type { EditorSuite } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import type { AssertT } from "doc-editor-utils";
import { setBlockNode } from "doc-editor-utils";
import type { FC } from "react";
import { useMemo } from "react";

import { HIGHLIGHT_BLOCK_KEY } from "../types";
import { COLOR_MAP } from "../types";

export const HighlightBlockWrapper: FC<{
  editor: EditorSuite;
  element: BlockElement;
  config: AssertT<BlockElement["highlight-block"]>;
  readonly: boolean;
}> = props => {
  const { editor, element, config, readonly } = props;

  const switchAction = useMemoizedFn((index: number) => {
    const path = ReactEditor.findPath(editor, element);
    setBlockNode(
      editor,
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
              borderColor: `rgb(${item.border})`,
              backgroundColor: `rgb(${item.background}, 0.4)`,
            }}
          ></div>
        ))}
      </div>
    );
  }, [switchAction]);

  const wrapper = (
    <div
      className="doc-highlight-block"
      style={{
        backgroundColor: `rgb(${config.background}, 0.4)`,
        borderColor: `rgb(${config.border})`,
      }}
    >
      {props.children}
    </div>
  );
  return readonly ? (
    wrapper
  ) : (
    <Trigger position="top" popup={() => Selector} popupAlign={{ top: 3 }}>
      {wrapper}
    </Trigger>
  );
};
