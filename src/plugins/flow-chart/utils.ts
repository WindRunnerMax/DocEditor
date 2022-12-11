export const xmlToString = (xml: Node | null): string | null => {
  if (!xml) return null;
  try {
    const serialize = new XMLSerializer();
    return serialize.serializeToString(xml);
  } catch (error) {
    console.log("XmlToString Error: ", error);
    return null;
  }
};
