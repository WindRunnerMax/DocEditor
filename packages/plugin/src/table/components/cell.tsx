import type { BlockContext } from "doc-editor-core";
import type { FC } from "react";

export const Cell: FC<{
  readonly: boolean;
  context: BlockContext;
}> = props => {
  const { context } = props;

  return (
    <td className="table-block-cell" {...context.props.attributes}>
      {/* COMPAT: 必须要从父层传递 否则会无限`ReRender` */}
      {props.children}
    </td>
  );
};
