// pages/api/update-rpc.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { rpc } = req.body;

    if (!rpc) {
      return res.status(400).json({ message: "RPC URL is required" });
    }

    const openbookPath = path.join(process.cwd(), "utils/openbook.ts");
    let openbookContent = fs.readFileSync(openbookPath, "utf-8");

    // Update the RPC line
    openbookContent = openbookContent.replace(
      /export const RPC = "([^"]+)";/,
      `export const RPC = "${rpc}";`
    );

    fs.writeFileSync(openbookPath, openbookContent);

    res.status(200).json({ message: "RPC URL updated successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
