import type { TriggerProps } from "@arco-design/web-react";
import { Trigger as ArcoTrigger } from "@arco-design/web-react";
import type { FC } from "react";
import { Fragment } from "react";

export const Trigger: FC<TriggerProps & { readonly?: boolean }> = props => {
  if (props.readonly) {
    return <Fragment>{props.children}</Fragment>;
  }
  return <ArcoTrigger {...props}>{props.children}</ArcoTrigger>;
};
