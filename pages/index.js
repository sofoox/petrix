// pages/index.js

import { useEffect, useState } from 'react';

export default function Home() {
  const [latestText, setLatestText] = useState(null);

  useEffect(() => {
    fetch('/api/latest-text')
      .then(res => res.json())
      .then(data => setLatestText(data?.text ?? null));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🧠 Ultima Predizione</h1>
      {latestText ? (
        <p>{latestText}</p>
      ) : (
        <p><em>Nessun testo salvato ancora.</em></p>
      )}
    </div>
  );
}
