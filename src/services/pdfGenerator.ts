import { DocumentData, GeneratedPdfInfo, AppSettings } from '../types';

/**
 * Calls the stateless PDF Generator microservice (via server proxy)
 * to pull the generated PDF byte stream directly from the API.
 */
export async function fetchMicroservicePdf(
  docData: DocumentData,
  settings: AppSettings
): Promise<GeneratedPdfInfo> {
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docData,
      baseUrl: settings.baseUrl,
      apiKey: settings.apiKey,
    }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    const detailMsg = errorJson?.details || errorJson?.error || `HTTP ${response.status} from PDF microservice`;
    throw new Error(detailMsg);
  }

  const blob = await response.blob();
  
  if (blob.type && !blob.type.includes('pdf') && blob.size < 200) {
    throw new Error('Microservice response was not a valid PDF document.');
  }

  // Create a blob URL for preview, download, and sharing
  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(pdfBlob);
  const sizeKb = Math.round(pdfBlob.size / 1024);

  return {
    docId: docData.docRefId,
    blobUrl,
    sizeKb,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    docType: docData.docType,
  };
}
