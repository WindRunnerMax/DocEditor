export const getLinkElement = (hash: string): HTMLElement | null => {
  return document.querySelector(`a[data-href="${hash}"]`);
};
