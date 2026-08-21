import { DocumentData, GeneratedPdfInfo, AppSettings } from '../types';

export function buildMicroservicePayload(docData: DocumentData) {
  const docType = docData.docType || 'INV';
  return {
    document_id: docData.docRefId || `${docType}-2026-0001`,
    date_issued: docData.issueDate || new Date().toISOString().split('T')[0],
    sender: {
      name: docData.sender?.name || 'SEIA Security System Services',
      address: docData.sender?.address || '114 Dahlia St., Diliman, Quezon City',
      email: docData.sender?.email || 'sherwinmadrid210@gmail.com',
      contact: docData.sender?.contact || '+63 977 015 9162',
    },
    recipient: {
      name: docData.recipient?.name || 'Valued Client',
      address: docData.recipient?.address || 'Client Address Unspecified',
      email: docData.recipient?.email || 'billing@client.com',
      contact: docData.recipient?.phone || '+63 900 000 0000',
    },
    project: {
      title: docData.projectTitle || 'Security System Services',
    },
    main_materials: (docData.materials || []).map((m) => ({
      description: m.description,
      quantity: (m.quantity || '1 Unit').replace(/[^a-zA-Z0-9\s\-\/]/g, '').replace(/\s+/g, ' ').trim() || '1 Unit',
    })),
    labor_and_other: (docData.labor || []).map((l) => ({
      description: l.description,
      quantity: (l.quantity || '1 Worker').replace(/[^a-zA-Z0-9\s\-\/]/g, '').replace(/\s+/g, ' ').trim() || '1 Worker',
    })),
    main_materials_total: Number(docData.materialsTotal) || 0,
    labor_other_total: Number(docData.laborTotal) || 0,
    total: Number(docData.grandTotal) || 0,
    notes: 'Official billing document generated via SEIA Security Mobile System',
  };
}

/**
 * Direct fallback request to Render microservice from client browser
 */
async function fetchDirectFromMicroservice(
  docData: DocumentData,
  settings: AppSettings
): Promise<Blob> {
  const cleanBaseUrl = (settings.baseUrl || 'https://pdfbuilder-2w8u.onrender.com/api/v1').replace(/\/+$/, '');
  const apiKey = settings.apiKey || 'TrrECb181CEcLjoVawVZYRJEuwsq0FDj';
  const docType = docData.docType || 'INV';
  const payload = buildMicroservicePayload(docData);

  let pluralType = 'invoices';
  if (docType === 'QTN') pluralType = 'quotations';
  if (docType === 'RCP') pluralType = 'receipts';

  const candidatePaths = [
    `/generate/${pluralType}`,
    `/${pluralType}/generate`,
  ];

  let lastErrorText = '';
  for (const pathSuffix of candidatePaths) {
    const targetUrl = `${cleanBaseUrl}${pathSuffix}`;
    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.blob();
      } else {
        lastErrorText = await res.text().catch(() => `HTTP ${res.status}`);
      }
    } catch (err: any) {
      lastErrorText = err.message || 'Direct network request failed';
    }
  }

  throw new Error(`Direct microservice call failed: ${lastErrorText}`);
}

/**
 * Calls the stateless PDF Generator microservice (via server proxy or direct fallback)
 */
export async function fetchMicroservicePdf(
  docData: DocumentData,
  settings: AppSettings
): Promise<GeneratedPdfInfo> {
  let blob: Blob;

  try {
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

    if (response.status === 404) {
      console.warn('Proxy /api/generate-pdf returned 404. Falling back to direct microservice request.');
      blob = await fetchDirectFromMicroservice(docData, settings);
    } else if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const detailMsg = errorJson?.details || errorJson?.error || `HTTP ${response.status} from PDF proxy`;
      throw new Error(detailMsg);
    } else {
      blob = await response.blob();
    }
  } catch (err: any) {
    if (err.message && err.message.includes('404')) {
      blob = await fetchDirectFromMicroservice(docData, settings);
    } else {
      try {
        blob = await fetchDirectFromMicroservice(docData, settings);
      } catch (directErr: any) {
        throw new Error(err.message || directErr.message || 'Failed to generate PDF document');
      }
    }
  }

  if (blob.type && !blob.type.includes('pdf') && blob.size < 200) {
    throw new Error('Microservice response was not a valid PDF document.');
  }

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
