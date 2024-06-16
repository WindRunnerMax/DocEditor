import { useSelected } from "doc-editor-delta";
import { cs } from "doc-editor-utils";
import type { FC } from "react";
import React from "react";

import styles from "./index.module.scss";

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
    <div className={cs(props.className, !props.readonly && selected && styles.selected)}>
      {withSelected()}
    </div>
  );
};
