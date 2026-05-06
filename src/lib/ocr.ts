import { createWorker } from 'tesseract.js';
import jsQR from 'jsqr';

export const scanQRCode = async (imageFile: File): Promise<any | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
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
        
        if (code) {
          try {
            resolve(JSON.parse(code.data));
          } catch (e) {
            console.error('Failed to parse QR data:', code.data);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  });
};

export const performOCR = async (imageFile: File | string, onProgress?: (progress: number) => void) => {
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
    console.error('OCR Error:', error);
    await worker.terminate();
    throw error;
  }
};

export const parseExtractedText = (text: string) => {
  // Simple heuristic parsing for the demo
  const lines = text.split('\n');
  const result: any = {
    enrollmentNumber: '',
    studentName: '',
    collegeName: '',
    branch: '',
    semester: '',
  };

  // Look for patterns like "Enrollment: EN..." or "Name: ..."
  lines.forEach(line => {
    const l = line.toLowerCase();
    if (l.includes('enrollment') || l.includes('enroll')) {
      result.enrollmentNumber = line.split(':').pop()?.trim().split(' ').shift() || '';
    }
    if (l.includes('name')) {
      result.studentName = line.split(':').pop()?.trim() || '';
    }
    if (l.includes('college') || l.includes('institute')) {
      result.collegeName = line.split(':').pop()?.trim() || '';
    }
    if (l.includes('branch') || l.includes('department')) {
      result.branch = line.split(':').pop()?.trim() || '';
    }
    if (l.includes('semester') || l.includes('sem')) {
      result.semester = line.split(':').pop()?.trim() || '';
    }
  });

  return result;
};
