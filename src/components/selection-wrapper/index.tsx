import styles from "./index.module.scss";
import React, { FC } from "react";
import { useSelected } from "slate-react";
import { cs } from "src/utils/classnames";

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
