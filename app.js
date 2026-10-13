import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Serve static assets from dist if built
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback: return index.html for any unknown route
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Forum Mentarimuda - Menyiapkan Build</title></head>
        <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc;">
          <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <h1 style="color: #0f172a; margin-bottom: 0.5rem;">Forum Mentarimuda Sedang Dipersiapkan</h1>
            <p style="color: #64748b; margin-bottom: 1.5rem;">Silakan jalankan <code>npm run build</code> untuk membuild antarmuka statis.</p>
          </div>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Forum Mentarimuda] Server aktif di port ${PORT}`);
});
