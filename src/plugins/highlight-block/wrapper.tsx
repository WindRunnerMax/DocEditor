import "./index.scss";
import { FC, useMemo } from "react";
import { BlockElement, Editor } from "slate";
import { AssertT } from "src/utils/common";
import { Trigger } from "@arco-design/web-react";
import { ReactEditor } from "slate-react";
import { setBlockNode } from "src/utils/slate-set";
import { useMemoizedFn } from "ahooks";

const highlightBlockKey = "highlight-block";
export const COLOR_MAP: AssertT<BlockElement["highlight-block"]>[] = [
  { background: "var(--blue-3)", border: "var(--blue-6)" },
  { background: "var(--green-3)", border: "var(--green-6)" },
  { background: "var(--orange-3)", border: "var(--orange-6)" },
  { background: "var(--red-3)", border: "var(--red-6)" },
  { background: "var(--purple-3)", border: "var(--purple-6)" },
  { background: "var(--gray-3)", border: "var(--gray-6)" },
  { background: "var(--magenta-3)", border: "var(--magenta-6)" },
  { background: "var(--pinkpurple-3)", border: "var(--pinkpurple-6)" },
  { background: "var(--orangered-3)", border: "var(--orangered-6)" },
  { background: "var(--cyan-3)", border: "var(--cyan-6)" },
  { background: "var(--lime-3)", border: "var(--lime-6)" },
  { background: "var(--gold-3)", border: "var(--gold-6)" },
  { background: "var(--yellow-3)", border: "var(--yellow-6)" },
];

export const HighlightBlockWrapper: FC<{
  editor: Editor;
  element: BlockElement;
  config: AssertT<BlockElement["highlight-block"]>;
  isRender: boolean;
}> = props => {
  const { editor, element, config, isRender } = props;

  const switchAction = useMemoizedFn((index: number) => {
    const path = ReactEditor.findPath(editor, element);
    setBlockNode(
      editor,
      { [highlightBlockKey]: COLOR_MAP[index] },
      { at: path, key: highlightBlockKey }
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
  return isRender ? (
    wrapper
  ) : (
    <Trigger position="top" popup={() => Selector} popupAlign={{ top: 3 }}>
      {wrapper}
    </Trigger>
  );
};
