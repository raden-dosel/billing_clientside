import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Dynamic CORS Configuration (reflects any requesting origin e.g. *.vercel.app, localhost, custom domains)
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    })
  );

  app.use(express.json({ limit: '10mb' }));

  // API Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', microservice: 'https://pdfbuilder-2w8u.onrender.com/api/v1' });
  });

  // Microservice PDF Generation Proxy
  app.post('/api/generate-pdf', async (req, res) => {
    try {
      const { docData, baseUrl = 'https://pdfbuilder-2w8u.onrender.com/api/v1', apiKey = 'secret-billing-api-key' } = req.body;

      if (!docData) {
        return res.status(400).json({ error: 'Missing document data payload' });
      }

      const docType = docData.docType || 'INV';
      const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

      // Map DocumentData to microservice DocumentPayload schema
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
        main_materials: (docData.materials || []).map((m: { description: string; quantity: string }) => ({
          description: m.description,
          quantity: (m.quantity || '1 Unit').replace(/[^a-zA-Z0-9\s\-\/]/g, '').replace(/\s+/g, ' ').trim() || '1 Unit',
        })),
        labor_and_other: (docData.labor || []).map((l: { description: string; quantity: string }) => ({
          description: l.description,
          quantity: (l.quantity || '1 Worker').replace(/[^a-zA-Z0-9\s\-\/]/g, '').replace(/\s+/g, ' ').trim() || '1 Worker',
        })),
        main_materials_total: Number(docData.materialsTotal) || 0,
        labor_other_total: Number(docData.laborTotal) || 0,
        total: Number(docData.grandTotal) || 0,
        notes: 'Official billing document generated via SEIA Security Mobile System',
      };

      // Determine candidate path suffixes (supports both /generate/invoices and /invoices/generate)
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
        return res.send(pdfBuffer);
      }

      // If microservice request returned an error
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
  });

  // Serve frontend in production or via Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
