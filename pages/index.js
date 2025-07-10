// pages/index.js

import { useEffect, useState } from 'react';

export default function Home() {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetch('/api/predict-latest')
      .then(res => res.json())
      .then(data => setPrediction(data));
  }, []);

  return (
    <div 
    style={{ 
      padding: '2rem', 
      fontFamily: 'Arial',
      color: 'white'}}
      <h1>ULTIMA PREDIZIONE</h1>
      {prediction ? (
        <div>
          <p><strong>Label:</strong> {prediction.label}</p>
          <p><strong>Confidence:</strong> {Math.round(prediction.confidence * 100)}%</p>
          <p><strong>Timestamp:</strong> {new Date(prediction.timestamp).toLocaleString()}</p>
          {prediction.image_base64 && (
            <img
              src={`data:image/jpeg;base64,${prediction.image_base64}`}
              alt="Prediction"
              style={{ maxWidth: '400px', marginTop: '1rem' }}
            />
          )}
        </div>
      ) : (
        <p><em>Nessuna predizione disponibile.</em></p>
      )}
    </div>
  );
}
