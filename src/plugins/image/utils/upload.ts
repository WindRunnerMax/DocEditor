export const uploadImageHandler = (file: File) => {
  return new Promise<{
    src: string;
    width: number;
    height: number;
  }>(resolve => {
    setTimeout(() => {
      const blobSRC = window.URL.createObjectURL(file);
      resolve({ src: blobSRC, width: 256, height: 256 });
    }, 1000);
  });
};
