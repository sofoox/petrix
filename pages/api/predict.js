import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: true,
  },
};

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
      console.error("Missing fields", { image, label, confidence, timestamp });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase.from('predict_texts').insert([{
      label,
      confidence,
      timestamp,
      image_base64: image,  // 👈 salvi direttamente la stringa base64
    }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: 'DB insert failed', details: error });
    }

    return res.status(200).json({ message: 'Prediction saved in Supabase', id: data?.[0]?.id ?? null });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
