export interface ValidationResult {
  isValid: boolean;
  fields: {
    name?: string;
    id?: string;
    date?: string;
    organization?: string;
  };
  suspiciousElements: string[];
  explanation: string;
}

export const validateCertificate = async (text: string): Promise<ValidationResult> => {
  // Simulate LLM processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const suspiciousElements: string[] = [];
  
  // Basic Extraction (Simulating LLM parsing)
  const nameMatch = text.match(/(?:Awarded to|Presented to|This certifies that)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  const idMatch = text.match(/(?:ID|Certificate No|Serial):\s*([A-Z0-9-]+)/i);
  const dateMatch = text.match(/(\d{1,2}(?:st|nd|rd|th)?\s+[A-Z][a-z]+,\s+\d{4}|\d{2}\/\d{2}\/\d{4})/i);
  const orgMatch = text.match(/(?:from|by)\s+([A-Z][A-Za-z\s]+(?:University|Inc|Corp|Academy|Institute))/i);

  const fields = {
    name: nameMatch ? nameMatch[1] : undefined,
    id: idMatch ? idMatch[1] : undefined,
    date: dateMatch ? dateMatch[1] : undefined,
    organization: orgMatch ? orgMatch[1] : undefined
  };

  // Logic-based Suspicion Analysis
  if (!fields.name) suspiciousElements.push("Recipient name not clearly identified.");
  if (!fields.id) suspiciousElements.push("Missing certificate serial number or ID.");
  if (!fields.date) suspiciousElements.push("Issuance date is missing or unreadable.");
  
  // Consistency checks
  if (fields.date) {
    const certDate = new Date(fields.date);
    const now = new Date();
    if (certDate > now) {
      suspiciousElements.push("Certificate date is in the future.");
    }
  }

  if (text.toLowerCase().includes("sample") || text.toLowerCase().includes("template")) {
    suspiciousElements.push("Document contains keywords like 'Sample' or 'Template'.");
  }

  // Generate Explanation
  let explanation = "";
  if (suspiciousElements.length === 0) {
    explanation = "This certificate appears to be authentic. All structured fields match standard formats and no inconsistencies were found.";
  } else {
    explanation = `This certificate looks suspicious because: ${suspiciousElements.join(' ')}`;
  }

  return {
    isValid: suspiciousElements.length === 0,
    fields,
    suspiciousElements,
    explanation
  };
};
