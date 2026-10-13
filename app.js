import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Dynamic static file serving: if dist exists, serve its static files
app.use((req, res, next) => {
  if (fs.existsSync(distPath)) {
    return express.static(distPath)(req, res, next);
  }
  next();
});

// SPA fallback: return index.html for client-side routing, or placeholder if build is pending
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forum Mentarimuda - Menyiapkan Aplikasi</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
          .card { text-align: center; max-width: 480px; padding: 2.5rem; background: #1e293b; border-radius: 1.25rem; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4); }
          h1 { font-size: 1.5rem; font-weight: 700; color: #38bdf8; margin: 0 0 1rem; }
          p { color: #94a3b8; line-height: 1.6; margin: 0 0 1.25rem; font-size: 0.95rem; }
          code { background: #0f172a; color: #38bdf8; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Forum Mentarimuda</h1>
          <p>Server Node.js aktif dengan baik. Untuk menampilkan antarmuka forum, jalankan perintah build di cPanel:</p>
          <p><code>npm run build</code></p>
          <p style="font-size: 0.85rem; color: #64748b;">Halaman ini akan otomatis menampilkan forum setelah folder <code>dist</code> tersedia tanpa perlu restart server.</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Forum Mentarimuda] Server aktif di port ${PORT}`);
});
