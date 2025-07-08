'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [latestText, setLatestText] = useState<string | null>(null)

  useEffect(() => {
    async function fetchText() {
      const res = await fetch('/api/latest-text')
      const json = await res.json()
      setLatestText(json?.text ?? null)
    }

    fetchText()
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🧠 Ultima Predizione</h1>
      {latestText ? <p>{latestText}</p> : <p><em>Nessun testo salvato ancora.</em></p>}
    </main>
  )
}
