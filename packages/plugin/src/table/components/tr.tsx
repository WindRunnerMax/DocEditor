import type { BlockContext } from "doc-editor-core";
import { isFunction, isNil } from "doc-editor-utils";
import type { FC } from "react";

import { useTableContext } from "../hooks/use-context";
import { NODE_TO_INDEX } from "../utils/node";

export const Tr: FC<{
  context: BlockContext;
}> = props => {
  const { context } = props;
  const { ref } = useTableContext();
  const index = NODE_TO_INDEX.get(context.element);

  const onRef = (el: HTMLTableRowElement) => {
    if (isFunction(context.props.attributes.ref)) {
      // https://github.com/ianstormtaylor/slate/blob/f3be9f1/packages/slate-react/src/components/element.tsx#L47
      context.props.attributes.ref(el as never);
    } else {
      // https://github.com/ianstormtaylor/slate/blob/25be3b7/packages/slate-react/src/components/element.tsx#L45
      context.props.attributes.ref.current = el;
    }
    if (!isNil(index)) {
      ref.trs[index] = el;
    }
  };

  return (
    <tr className="table-block-tr" {...context.props.attributes} ref={onRef}>
      {props.children}
    </tr>
  );
};
