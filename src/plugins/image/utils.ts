export const uploadImageHandler = (file: File) => {
  return new Promise<{ src: string }>(resolve => {
    setTimeout(() => {
      const blobSRC = window.URL.createObjectURL(file);
      resolve({ src: blobSRC });
    }, 1000);
  });
};
