// pages/api/predict.js

import formidable from "formidable";
import fs from "fs";
import path from "path";
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

  const form = new formidable.IncomingForm({ uploadDir: "/tmp", keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    // 📸 Upload immagine
    if (files.image) {
      const image = files.image[0]; // Vercel usa array per ogni campo
      const fileName = `${Date.now()}_${image.originalFilename}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const targetPath = path.join(uploadDir, fileName);
      fs.renameSync(image.filepath, targetPath);

      const imageUrl = `/uploads/${fileName}`;
      return res.status(200).json({ message: "Image uploaded", imageUrl });
    }

    // 📝 Salva testo
    if (fields.text) {
      const { error } = await supabase
        .from("predict_texts")
        .insert({ text: fields.text[0] });

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ error: "Failed to insert text" });
      }

      return res.status(200).json({ message: "Text saved to DB" });
    }

    return res.status(400).json({ error: "No valid data received" });
  });
}
