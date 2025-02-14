// pages/api/update-logo.ts
import { IncomingForm, File } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error parsing form data" });
      }

      const file = files.file as File;

      // Ensure file is defined and extract the path correctly
      if (!file || !file.filepath) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const oldPath = file.filepath;
      const newPath = path.join(process.cwd(), "public/logo.png");

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving file" });
        }

        res.status(200).json({ message: "Logo updated successfully" });
      });
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
