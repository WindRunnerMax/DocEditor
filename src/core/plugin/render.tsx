import { RenderElementProps, RenderLeafProps } from "slate-react";
import { ElementContext, ElementPlugin, LeafContext, LeafPlugin } from "./interface";

export const renderElement = (props: RenderElementProps, elementPlugins: ElementPlugin[]) => {
  const context: ElementContext = {
    props,
    style: {},
    classList: [],
    element: props.element,
    children: props.children,
  };
  for (const item of elementPlugins) {
    if (item.match(props) && item.render) {
      context.children = (
        <>
          {props.children}
          <div contentEditable={false}>{item.render(context)}</div>
        </>
      );
      break;
    }
  }
  for (let i = elementPlugins.length - 1; i >= 0; i--) {
    const item = elementPlugins[i];
    if (item.match(props) && item.renderLine) {
      context.children = item.renderLine(context);
    }
  }
  return (
    <div {...props.attributes} className={context.classList.join(" ")} style={context.style}>
      {context.children}
    </div>
  );
};

export const renderLeaf = (props: RenderLeafProps, leafPlugins: LeafPlugin[]) => {
  const context: LeafContext = {
    props,
    style: {},
    element: props.text,
    classList: [],
    children: props.children,
  };
  for (const item of leafPlugins) {
    if (item.match(props) && item.render) {
      context.children = item.render(context);
    }
  }
  return (
    <span {...props.attributes} className={context.classList.join(" ")} style={context.style}>
      {context.children}
    </span>
  );
};
