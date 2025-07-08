import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Disattiva il body parser di Next.js per usare formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Inizializza il client Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Parser form asincrono
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, uploadDir: '/tmp' });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Endpoint principale
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

    // ✅ GESTIONE IMMAGINE
    if (files.image) {
      const image = files.image;
      const fileName = `${Date.now()}_${image.originalFilename}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const targetPath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.renameSync(image.filepath, targetPath);

      return res.status(200).json({
        message: 'Image uploaded',
        imageUrl: `/uploads/${fileName}`,
      });
    }

    // ✅ GESTIONE TESTO
    if (fields.text) {
      const { error } = await supabase
        .from('predict_texts')
        .insert({ text: fields.text });

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: 'Failed to insert text' });
      }

      return res.status(200).json({ message: 'Text saved to DB' });
    }

    return res.status(400).json({ error: 'No valid data received' });
  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
