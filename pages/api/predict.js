// pages/api/predict.js

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

    // Salva metadati e immagine base64 nel DB
    const { data, error } = await supabase.from('predict_texts').insert({
      label,
      confidence,
      timestamp,
      image_base64: image
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to insert data into Supabase' });
    }

    return res.status(200).json({
      message: 'Prediction received and saved',
      rows_received: 1,
      inserted_id: data?.[0]?.id || null
    });
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
