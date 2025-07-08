import { createClient } from '@supabase/supabase-js';

// Inizializza il client Supabase
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

    // Verifica che i campi siano presenti
    if (!image || !label || typeof confidence === 'undefined' || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Inserisci i dati (inclusa immagine base64) nella tabella "predict_texts"
    const { error } = await supabase.from('predict_texts').insert({
      label,
      confidence,
      timestamp,
      image_base64: image // 📌 assicurati che questa colonna esista su Supabase
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
