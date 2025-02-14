// pages/api/update-colors.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { mainBg, mainText, secondaryBg, titleText, hoverOne, hoverTwo } =
      req.body;

    const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js");
    let tailwindConfig = fs.readFileSync(tailwindConfigPath, "utf-8");

    // Extract the existing color configuration
    const colorConfigMatch = tailwindConfig.match(/colors: \{([^}]+)\}/);
    if (!colorConfigMatch) {
      return res
        .status(500)
        .json({ message: "Invalid Tailwind configuration format" });
    }

    let colorConfig = colorConfigMatch[1];

    // Function to update color in the configuration string
    const updateColor = (config, colorName, newValue) => {
      const regex = new RegExp(`"${colorName}": "([^"]+)"`);
      if (newValue) {
        return config.replace(regex, `"${colorName}": "${newValue}"`);
      }
      return config;
    };

    // Update only the provided values
    colorConfig = updateColor(colorConfig, "main-bg", mainBg);
    colorConfig = updateColor(colorConfig, "main-text", mainText);
    colorConfig = updateColor(colorConfig, "secondary-bg", secondaryBg);
    colorConfig = updateColor(colorConfig, "title-text", titleText);
    colorConfig = updateColor(colorConfig, "hover-one", hoverOne);
    colorConfig = updateColor(colorConfig, "hover-two", hoverTwo);

    // Replace the old color configuration with the updated one
    tailwindConfig = tailwindConfig.replace(
      /colors: \{[^}]+\}/,
      `colors: {${colorConfig}}`
    );

    fs.writeFileSync(tailwindConfigPath, tailwindConfig);

    res.status(200).json({ message: "Colors updated successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
