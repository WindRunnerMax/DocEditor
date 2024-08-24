import "../styles/selection.scss";

import type { EditorKit } from "doc-editor-core";
import type { Path } from "doc-editor-delta";
import { useSelected } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { cs } from "doc-editor-utils";
import type { FC } from "react";
import React from "react";

export const focusSelection = (editor: EditorKit, path?: Path, edge?: "start" | "end") => {
  ReactEditor.focus(editor.raw);
  if (path) {
    Transforms.select(editor.raw, path);
    Transforms.collapse(editor.raw, { edge: edge || "end" });
  } else {
    Transforms.collapse(editor.raw, { edge: "focus" });
  }
};

export const SelectionWrapper: FC<{
  readonly: boolean;
  className?: string;
}> = props => {
  const selected = useSelected();

  const withSelected = () => {
    return React.Children.map(props.children, child => {
      if (React.isValidElement(child)) {
        const { props } = child;
        return React.cloneElement(child, { ...props, selected: selected });
      } else {
        return child;
      }
    });
  };

  return (
    <div className={cs(props.className, !props.readonly && selected && "doc-block-selected")}>
      {withSelected()}
    </div>
  );
};
