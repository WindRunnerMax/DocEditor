import DOMNode = globalThis.Node;
import DOMText = globalThis.Text;
import DOMElement = globalThis.Element;

export const isDOMNode = (value: unknown): value is DOMNode => {
  return value instanceof Node;
};

export const isDOMText = (value: unknown): value is DOMText => {
  return isDOMNode(value) && value.nodeType === DOMNode.TEXT_NODE;
};

export const isDOMElement = (value: unknown): value is DOMElement => {
  return isDOMNode(value) && value.nodeType === DOMNode.ELEMENT_NODE;
};

export const isHTMLElement = (value: unknown): value is HTMLElement => {
  return isDOMNode(value) && value instanceof HTMLElement;
};
