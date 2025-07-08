// pages/api/predict.js

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image, label, confidence, timestamp } = req.body;

    if (!image || !label || typeof confidence === 'undefined' || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 🔽 Salva immagine base64 su /public/uploads/
    const buffer = Buffer.from(image, 'base64');
    const fileName = `${Date.now()}_${label}.jpg`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // 🔽 Salva metadati in Supabase
    const { error } = await supabase.from('predict_texts').insert({
      label,
      confidence,
      timestamp,
      image_path: `/uploads/${fileName}`
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to insert data into Supabase' });
    }

    return res.status(200).json({ message: 'Prediction received and saved' });
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
