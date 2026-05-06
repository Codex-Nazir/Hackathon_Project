import { findCertificate } from './mockDatabase';
import type { CertificateRecord } from './mockDatabase';

export interface ValidationResult {
  isValid: boolean;
  isTampered: boolean;
  confidence: number;
  extractedData: any;
  databaseRecord?: CertificateRecord;
  discrepancies: string[];
  tamperingDetails: string[];
}

export const validateCertificate = (extractedData: any): ValidationResult => {
  const record = findCertificate(extractedData.enrollmentNumber);
  const discrepancies: string[] = [];
  const tamperingDetails: string[] = [];
  let isTampered = false;

  if (!record) {
    return {
      isValid: false,
      isTampered: false,
      confidence: 0,
      extractedData,
      discrepancies: ['Enrollment Number not found in official database.'],
      tamperingDetails: []
    };
  }

  // Compare fields
  if (extractedData.studentName && record.studentName.toLowerCase() !== extractedData.studentName.toLowerCase()) {
    discrepancies.push(`Name mismatch: Found "${extractedData.studentName}", expected "${record.studentName}"`);
  }
  
  if (extractedData.collegeName && !record.collegeName.toLowerCase().includes(extractedData.collegeName.toLowerCase())) {
    discrepancies.push(`College mismatch: Found "${extractedData.collegeName}", expected "${record.collegeName}"`);
  }

  // Simulated Tampering Detection Logic
  // 1. Check for inconsistent capitalization (common in manual edits)
  if (extractedData.studentName && extractedData.studentName !== extractedData.studentName.toUpperCase() && extractedData.studentName !== record.studentName) {
    // This is just a heuristic for the demo
    tamperingDetails.push('Irregular text alignment or casing detected in Name field.');
    isTampered = true;
  }

  // 2. Simulated "Pixel Analysis"
  // In a real app, we'd use a CNN to detect noise around text. 
  // Here we'll simulate it by checking if certain keywords are present that shouldn't be, 
  // or just randomly assigning "tampered" if the data is slightly off but exists.
  if (discrepancies.length > 0) {
    tamperingDetails.push('Digital manipulation artifacts detected around discrepancy zones.');
    isTampered = true;
  }

  const isValid = discrepancies.length === 0 && !isTampered;

  return {
    isValid,
    isTampered,
    confidence: isValid ? 98 : 45,
    extractedData,
    databaseRecord: record,
    discrepancies,
    tamperingDetails
  };
};
