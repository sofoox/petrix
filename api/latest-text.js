// pages/api/latest-text.js

export default async function handler(req, res) {
  try {
    // qui metterai il tuo vero codice DB, per ora un dummy:
    const dummy = { text: 'Questa è la tua ultima predizione!' };

    // se vuoi eseguire la tua query sul DB, la inserisci qui
    // es. const { data } = await supabase.from('predict_texts').select('text').order('timestamp', { ascending: false }).limit(1);

    res.status(200).json(dummy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno' });
  }
}
