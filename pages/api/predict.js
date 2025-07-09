export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log("REQ BODY:", req.body);

    const { image, label, confidence, timestamp } = req.body;

    if (!image || !label || typeof confidence === 'undefined' || !timestamp) {
      console.log("Missing fields:", { image, label, confidence, timestamp });
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
