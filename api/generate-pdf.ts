import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://pdfbuilder-2w8u.onrender.com/api/v1');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { docData, baseUrl = 'https://pdfbuilder-2w8u.onrender.com/api/v1', apiKey = 'TrrECb181CEcLjoVawVZYRJEuwsq0FDj' } = req.body || {};

    if (!docData) {
      return res.status(400).json({ error: 'Missing document data payload' });
    }

    const docType = docData.docType || 'INV';
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    const payload = {
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
        contact: docData.recipient?.phone || docData.recipient?.contact || '+63 900 000 0000',
      },
      project: {
        title: docData.projectTitle || 'Security System Services',
      },
      main_materials: (docData.materials || []).map((m: any) => ({
        description: m.description,
        quantity: (m.quantity || '1 Unit').replace(/[^a-zA-Z0-9\s\-\/]/g, '').replace(/\s+/g, ' ').trim() || '1 Unit',
      })),
      labor_and_other: (docData.labor || []).map((l: any) => ({
        description: l.description,
        quantity: (l.quantity || '1 Worker').replace(/[^a-zA-Z0-9\s\-\/]/g, '').replace(/\s+/g, ' ').trim() || '1 Worker',
      })),
      main_materials_total: Number(docData.materialsTotal) || 0,
      labor_other_total: Number(docData.laborTotal) || 0,
      total: Number(docData.grandTotal) || 0,
      notes: 'Official billing document generated via SEIA Security Mobile System',
    };

    let pluralType = 'invoices';
    if (docType === 'QTN') pluralType = 'quotations';
    if (docType === 'RCP') pluralType = 'receipts';

    const candidatePaths = [
      `/generate/${pluralType}`,
      `/${pluralType}/generate`,
    ];

    let lastErrorResponse: { status: number; text: string } | null = null;
    let pdfBuffer: Buffer | null = null;

    for (const pathSuffix of candidatePaths) {
      const targetUrl = `${cleanBaseUrl}${pathSuffix}`;
      try {
        const upstreamRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(payload),
        });

        if (upstreamRes.ok) {
          const arrayBuf = await upstreamRes.arrayBuffer();
          pdfBuffer = Buffer.from(arrayBuf);
          break;
        } else {
          const errText = await upstreamRes.text();
          lastErrorResponse = { status: upstreamRes.status, text: errText };
        }
      } catch (fetchErr: any) {
        lastErrorResponse = { status: 502, text: fetchErr.message || 'Fetch failed' };
      }
    }

    if (pdfBuffer) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${payload.document_id}.pdf"`);
      return res.status(200).send(pdfBuffer);
    }

    return res.status(lastErrorResponse?.status || 500).json({
      error: 'PDF Microservice Error',
      status: lastErrorResponse?.status,
      details: lastErrorResponse?.text || 'Failed to pull generated PDF from microservice.',
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      details: err.message || 'Error communicating with PDF microservice',
    });
  }
}
