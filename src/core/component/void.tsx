import { FC } from "react";

export const Void: FC = props => {
  return <div contentEditable={false}>{props.children}</div>;
};
