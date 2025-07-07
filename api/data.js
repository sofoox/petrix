import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const results = [];

  try {
    await new Promise((resolve, reject) => {
      req
        .pipe(csv())
        .on("data", (data) => {
          try {
            const parsed = {
              timestamp: data.timestamp,
              pir: parseInt(data.pir, 10),
              touch_right: parseInt(data.touch_right, 10),
              touch_left: parseInt(data.touch_left, 10),
              light_right: parseInt(data.light_right, 10),
              light_left: parseInt(data.light_left, 10),
              ir_right: parseInt(data.ir_right, 10),
              ir_left: parseInt(data.ir_left, 10),
              label: data.label,
            };
            results.push(parsed);
          } catch (e) {
            console.error("Parsing error:", e);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const inserted = [];
    for (const row of results) {
      const { error } = await supabase.from("sensor_data").insert(row);
      if (error) {
        console.error("DB insert error:", error);
      } else {
        inserted.push(row);
      }
    }

    return res.status(200).json({
      message: "CSV parsed and data inserted into Supabase",
      rows_received: results.length,
      rows_inserted: inserted.length,
    });
  } catch (error) {
    console.error("CSV parsing or DB error:", error);
    return res.status(500).json({ error: "Failed to parse CSV or insert data" });
  }
}
