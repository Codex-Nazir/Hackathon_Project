export interface PipelineResults {
  ocrText: string;
  qrData: string | null;
  structuredFields: {
    name: string;
    id: string;
    date: string;
    org: string;
  };
  analysis: {
    logoFound: boolean;
    signatureFound: boolean;
    stampFound: boolean;
    layoutScore: number;
    dbMatch: boolean;
  };
  fraudScore: number; // 0-100
  status: 'GENUINE' | 'FAKE' | 'SUSPICIOUS';
  explanation: string;
}

// Mock Database of "Registered" Certificates
const REGISTERED_IDS = ["CERT-2024-001", "SENTINEL-X-99", "ACAD-7742-B"];

export const analyzeCertificate = async (text: string, qrData: string | null): Promise<PipelineResults> => {
  // Simulate heavy AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  const nameMatch = text.match(/(?:Awarded to|Presented to|Name:)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  const idMatch = text.match(/(?:ID|Cert No|Serial|#):\s*([A-Z0-9-]+)/i);
  const dateMatch = text.match(/(\d{1,2}(?:st|nd|rd|th)?\s+[A-Z][a-z]+,\s+\d{4}|\d{2}\/\d{2}\/\d{4})/i);
  const orgMatch = text.match(/(?:from|by|at)\s+([A-Z][A-Za-z\s]+(?:Academy|University|Inc|Corp|Institute))/i);

  const fields = {
    name: nameMatch ? nameMatch[1] : "Unknown Recipient",
    id: idMatch ? idMatch[1] : "N/A",
    date: dateMatch ? dateMatch[1] : "N/A",
    org: orgMatch ? orgMatch[1] : "Unknown Organization"
  };

  // Simulated AI Engine results
  const logoFound = text.toLowerCase().includes("seal") || text.length > 100; // heuristic
  const signatureFound = text.toLowerCase().includes("signed") || text.toLowerCase().includes("authorized");
  const stampFound = Math.random() > 0.3;
  const layoutScore = Math.floor(Math.random() * 20) + 80; // 80-100
  const dbMatch = REGISTERED_IDS.includes(fields.id) || (qrData !== null && qrData.includes(fields.id));

  // Fraud Detection Model Logic
  let fraudScore = 0;
  const flags: string[] = [];

  if (fields.id === "N/A") { fraudScore += 40; flags.push("Missing ID"); }
  if (!dbMatch) { fraudScore += 30; flags.push("ID not found in registry"); }
  if (!logoFound) { fraudScore += 20; flags.push("Missing official logo patterns"); }
  if (fields.date !== "N/A") {
    const certDate = new Date(fields.date);
    if (certDate > new Date()) { fraudScore += 50; flags.push("Future issuance date detected"); }
  }

  let status: PipelineResults['status'] = 'GENUINE';
  if (fraudScore > 60) status = 'FAKE';
  else if (fraudScore > 20) status = 'SUSPICIOUS';

  let explanation = "";
  if (status === 'GENUINE') {
    explanation = "The certificate passed all multi-stage verification protocols. OCR metadata, QR consistency, and layout matching indicate high authenticity.";
  } else if (status === 'FAKE') {
    explanation = `High fraud probability detected (${fraudScore}%). Critical issues: ${flags.join(', ')}. The document fails database verification and exhibits structural anomalies.`;
  } else {
    explanation = `Minor anomalies detected (${fraudScore}%). Issues: ${flags.join(', ')}. Recommended for manual administrative review.`;
  }

  return {
    ocrText: text,
    qrData,
    structuredFields: fields,
    analysis: { logoFound, signatureFound, stampFound, layoutScore, dbMatch },
    fraudScore: Math.min(100, fraudScore),
    status,
    explanation
  };
};
