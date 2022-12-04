import type { stringToXml, xmlToString } from "embed-drawio";

export const normalizationXML = (
  s2x: typeof stringToXml,
  x2s: typeof xmlToString,
  xml: string
): string | null => {
  const xmlNode = s2x(xml);
  if (xmlNode && xmlNode.documentElement.firstChild) {
    const str = x2s(xmlNode.documentElement.firstChild.firstChild);
    return str;
  }
  return null;
};
