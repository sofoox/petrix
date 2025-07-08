
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ error: "Empty request body" });
    }

    const records = Array.isArray(body) ? body : [body];

    const parsedRecords = records.map((data) => ({
      timestamp: data.timestamp,
      pir: parseInt(data.pir, 10),
      touch_right: parseInt(data.touch_right, 10),
      touch_left: parseInt(data.touch_left, 10),
      light_right: parseInt(data.light_right, 10),
      light_left: parseInt(data.light_left, 10),
      ir_right: parseInt(data.ir_right, 10),
      ir_left: parseInt(data.ir_left, 10),
      label: data.label,
    }));

    const { error } = await supabase
      .from("sensor_data")
      .insert(parsedRecords);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to insert data into Supabase" });
    }

    return res.status(200).json({
      message: "JSON parsed and data inserted into Supabase",
      rows_received: parsedRecords.length
    });
  } catch (error) {
    console.error("JSON parsing or DB error:", error);
    return res.status(500).json({ error: "Failed to parse JSON or insert data" });
  }
}
