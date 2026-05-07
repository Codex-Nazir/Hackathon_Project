import jsQR from 'jsqr';

export const scanQRCode = async (imageFile: File | string): Promise<string | null> => {
  return new Promise((resolve) => {
    const processImage = (src: string) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        resolve(code ? code.data : null);
      };
      img.src = src;
    };

    if (typeof imageFile === 'string') {
      processImage(imageFile);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => processImage(e.target?.result as string);
      reader.readAsDataURL(imageFile);
    }
  });
};
