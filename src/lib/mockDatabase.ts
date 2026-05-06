export interface CertificateRecord {
  enrollmentNumber: string;
  studentName: string;
  collegeName: string;
  branch: string;
  semester: string;
  passingYear: string;
  issueDate: string;
  hash: string; // Used for simulated integrity check
}

export const mockDatabase: CertificateRecord[] = [
  {
    enrollmentNumber: "EN2021001",
    studentName: "John Doe",
    collegeName: "Tech Institute of Excellence",
    branch: "Computer Science",
    semester: "8th",
    passingYear: "2025",
    issueDate: "2025-05-10",
    hash: "a1b2c3d4e5f6"
  },
  {
    enrollmentNumber: "EN2021002",
    studentName: "Jane Smith",
    collegeName: "Global Engineering College",
    branch: "Electronics",
    semester: "8th",
    passingYear: "2025",
    issueDate: "2025-05-12",
    hash: "f6e5d4c3b2a1"
  },
  {
    enrollmentNumber: "EN2021005",
    studentName: "Nazir Ahmad",
    collegeName: "State University",
    branch: "Information Technology",
    semester: "6th",
    passingYear: "2026",
    issueDate: "2026-04-15",
    hash: "987654321abc"
  }
];

export const findCertificate = (enrollmentNumber: string) => {
  return mockDatabase.find(cert => cert.enrollmentNumber.toLowerCase() === enrollmentNumber.toLowerCase());
};
