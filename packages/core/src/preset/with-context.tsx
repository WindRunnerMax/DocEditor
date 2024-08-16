import { useSlate } from "doc-editor-delta";
import type { FC } from "react";
import { useEffect, useRef } from "react";

import type { EditorKit } from "../editor";
import { EDITOR_EVENT } from "../event/bus/action";

export const WithContext: FC<{ editor: EditorKit }> = props => {
  const { editor, children } = props;
  const isNeedPaint = useRef(true);
  // 保证每次触发 Apply 时都会重新渲染
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/slate.tsx#L29
  useSlate();

  useEffect(() => {
    const onContentChange = () => {
      isNeedPaint.current = true;
    };
    editor.event.on(EDITOR_EVENT.CONTENT_CHANGE, onContentChange, 1);
    return () => {
      editor.event.off(EDITOR_EVENT.CONTENT_CHANGE, onContentChange);
    };
  }, [editor]);

  useEffect(() => {
    if (isNeedPaint.current) {
      Promise.resolve().then(() => {
        editor.event.trigger(EDITOR_EVENT.PAINT, {});
      });
    }
    isNeedPaint.current = false;
  });

  return children as JSX.Element;
};
