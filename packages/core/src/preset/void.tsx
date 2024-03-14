import type { FC } from "react";

export const Void: FC<{ className?: string; selectable?: boolean }> = props => {
  const { className, selectable = true } = props;
  return (
    <div
      contentEditable={false}
      className={className}
      style={{ userSelect: selectable ? undefined : "none" }}
    >
      {props.children}
    </div>
  );
};
