import { createClient } from '@supabase/supabase-js';

export async function getServerSideProps() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('inserted_at', { ascending: false })
    .limit(100); // mostra al massimo gli ultimi 100 dati

  if (error) {
    console.error("Supabase error:", error);
    return { props: { data: [], error: error.message } };
  }

  return { props: { data } };
}

export default function Dashboard({ data, error }) {
  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sensor Data Dashboard</h1>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>PIR</th>
            <th>Touch R</th>
            <th>Touch L</th>
            <th>Light R</th>
            <th>Light L</th>
            <th>IR R</th>
            <th>IR L</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.timestamp}</td>
              <td>{row.pir}</td>
              <td>{row.touch_right}</td>
              <td>{row.touch_left}</td>
              <td>{row.light_right}</td>
              <td>{row.light_left}</td>
              <td>{row.ir_right}</td>
              <td>{row.ir_left}</td>
              <td>{row.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
