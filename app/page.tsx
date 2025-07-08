// pages/index.js

import { createClient } from "@supabase/supabase-js";

export async function getServerSideProps() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("predict_texts")
    .select("text, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return {
    props: {
      latestText: data?.text || null,
    },
  };
}

export default function Home({ latestText }) {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🧠 Ultima Predizione</h1>
      {latestText ? (
        <p>{latestText}</p>
      ) : (
        <p><em>Nessun testo salvato ancora.</em></p>
      )}
    </div>
  );
}
