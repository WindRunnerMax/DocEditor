import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { setTextNode } from "../../utils/slate-utils";

export const strikeThroughPluginKey = "strike-through";

export const StrikeThroughPlugin = (): Plugin => {
  return {
    key: strikeThroughPluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[strikeThroughPluginKey],
    command: (editor, key) => {
      setTextNode(editor, { [key]: true });
    },
    render: context => <del>{context.children}</del>,
  };
};
