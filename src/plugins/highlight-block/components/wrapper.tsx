import "../index.scss";
import { FC, useMemo } from "react";
import { BlockElement, Editor } from "slate";
import { AssertT } from "src/utils/common";
import { Trigger } from "@arco-design/web-react";
import { ReactEditor } from "slate-react";
import { setBlockNode } from "src/core/ops/set";
import { useMemoizedFn } from "ahooks";
import { HIGHLIGHT_BLOCK_KEY } from "../types";
import { COLOR_MAP } from "../types";

export const HighlightBlockWrapper: FC<{
  editor: Editor;
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
