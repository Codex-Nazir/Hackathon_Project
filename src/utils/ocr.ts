import { createWorker } from 'tesseract.js';

export const extractText = async (imageFile: File | string, onProgress?: (p: number) => void) => {
  const worker = await createWorker('eng', 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    }
  });

  try {
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR Extraction Error:', error);
    await worker.terminate();
    throw error;
  }
};
