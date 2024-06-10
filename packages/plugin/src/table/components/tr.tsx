import type { BlockContext } from "doc-editor-core";
import type { FC } from "react";

export const Tr: FC<{
  context: BlockContext;
}> = props => {
  const { context } = props;

  return (
    <tr className="table-block-tr" {...context.props.attributes}>
      {props.children}
    </tr>
  );
};
