import csv from "csv-parser";

export const config = {
  api: {
    bodyParser: false,  // Disattiviamo il body parser per leggere lo stream grezzo
  },
};

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
            // Converte i campi numerici se serve
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

    return res.status(200).json({
      message: "CSV parsed successfully",
      rows: results.length,
      data: results,
    });
  } catch (error) {
    console.error("CSV parsing failed:", error);
    return res.status(500).json({ error: "Failed to parse CSV" });
  }
}
