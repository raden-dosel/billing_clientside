export type DocType = 'INV' | 'QTN' | 'RCP';

export interface MaterialItem {
  id: string;
  description: string;
  quantity: string;
}

export interface LaborItem {
  id: string;
  description: string;
  quantity: string;
}

export interface SenderDetails {
  name: string;
  address: string;
  email: string;
  contact: string;
}

export interface RecipientDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface DocumentData {
  docType: DocType;
  docRefId: string;
  issueDate: string;
  sender: SenderDetails;
  recipient: RecipientDetails;
  projectTitle: string;
  materials: MaterialItem[];
  labor: LaborItem[];
  materialsTotal: number;
  laborTotal: number;
  grandTotal: number;
}

export interface AppSettings {
  baseUrl: string;
  apiKey: string;
}

export interface GeneratedPdfInfo {
  docId: string;
  blobUrl: string;
  sizeKb: number;
  timestamp: string;
  docType: DocType;
}

export interface SecurityPreset {
  id: string;
  name: string;
  projectTitle: string;
  materials: { description: string; quantity: string }[];
  labor: { description: string; quantity: string }[];
  materialsTotal: number;
  laborTotal: number;
  grandTotal: number;
}
