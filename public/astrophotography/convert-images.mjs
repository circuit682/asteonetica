import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const widths = [600, 1024, 1920, 3840];
const labels = ["600w", "1024w", "1920w", "4k"];
const quality = 85;

const files = fs
  .readdirSync(".")
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

if (files.length === 0) {
  console.log("No source images found.");
  process.exit(0);
}

for (const img of files) {
  const ext = path.extname(img);
  const base = path.basename(img, ext);
  console.log(`Processing ${base}...`);

  for (let i = 0; i < widths.length; i += 1) {
    const width = widths[i];
    const label = labels[i];
    const out = `${base}-${label}.webp`;

    await sharp(img)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(out);
  }
}
