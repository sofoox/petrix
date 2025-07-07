import { createClient } from '@supabase/supabase-js';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export async function getServerSideProps() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('inserted_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error("Supabase error:", error);
    return { props: { data: [], error: error.message } };
  }

  return { props: { data: data.reverse() } }; // invertiamo per grafici in ordine cronologico
}

export default function Dashboard({ data, error }) {
  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Sensor Data Dashboard</h1>

      <div style={{ margin: '20px 0' }}>
        <h2>PIR Sensor</h2>
        <Chart data={data} dataKey="pir" color="#8884d8" />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Touch Sensors</h2>
        <Chart data={data} dataKey="touch_right" color="#82ca9d" name="Touch Right" />
        <Chart data={data} dataKey="touch_left" color="#ff7300" name="Touch Left" />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Light Sensors</h2>
        <Chart data={data} dataKey="light_right" color="#0088FE" name="Light Right" />
        <Chart data={data} dataKey="light_left" color="#00C49F" name="Light Left" />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>IR Sensors</h2>
        <Chart data={data} dataKey="ir_right" color="#FFBB28" name="IR Right" />
        <Chart data={data} dataKey="ir_left" color="#FF8042" name="IR Left" />
      </div>

      <div style={{ margin: '40px 0' }}>
        <h2>Raw Data Table (Last 100 rows)</h2>
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
    </div>
  );
}

function Chart({ data, dataKey, color, name }) {
  return (
    <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} name={name || dataKey} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
