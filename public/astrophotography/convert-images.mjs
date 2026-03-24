import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const widths = [600, 1024, 1920, 3840];
const labels = ["600w", "1024w", "1920w", "4k"];
const quality = 85;
const sourceRoot = path.resolve("./sources");
const workspaceRoot = path.resolve(".");

/**
 * @param {string} filePath
 */
function outputBaseName(filePath) {
  const stem = path.basename(filePath, path.extname(filePath));
  const dir = path.dirname(filePath);

  if (dir.startsWith(sourceRoot)) {
    const object = path.basename(dir).toLowerCase();
    const normalizedStem = stem.toLowerCase();

    if ([object, "primary", "main", "source", "raw"].includes(normalizedStem)) {
      return object;
    }

    return `${object}-${normalizedStem}`;
  }

  return stem;
}

/**
 * @param {string} filePath
 * @param {string} base
 * @param {string} label
 */
function outputPath(filePath, base, label) {
  const dir = path.dirname(filePath);

  if (dir.startsWith(sourceRoot) || dir === workspaceRoot) {
    return path.join(workspaceRoot, `${base}-${label}.webp`);
  }

  return path.join(dir, `${base}-${label}.webp`);
}

/**
 * @param {string} filePath
 */
function isSourceImage(filePath) {
  return /\.(jpg|jpeg|png)$/i.test(filePath);
}

const files = [];

// Backward compatibility: images in current folder root.
for (const entry of fs.readdirSync(".")) {
  if (isSourceImage(entry)) {
    files.push(path.resolve(entry));
  }
}

// New structure: ./sources/<object>/<image>
if (fs.existsSync(sourceRoot)) {
  for (const objectEntry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!objectEntry.isDirectory()) continue;

    const objectDir = path.join(sourceRoot, objectEntry.name);
    for (const fileEntry of fs.readdirSync(objectDir, { withFileTypes: true })) {
      if (!fileEntry.isFile()) continue;

      const filePath = path.join(objectDir, fileEntry.name);
      if (isSourceImage(filePath)) {
        files.push(filePath);
      }
    }
  }
}

// Preferred structure: ./<object>/<image>
for (const entry of fs.readdirSync(workspaceRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (entry.name === "sources") continue;

  const objectDir = path.join(workspaceRoot, entry.name);
  for (const fileEntry of fs.readdirSync(objectDir, { withFileTypes: true })) {
    if (!fileEntry.isFile()) continue;

    const filePath = path.join(objectDir, fileEntry.name);
    if (isSourceImage(filePath)) {
      files.push(filePath);
    }
  }
}

if (files.length === 0) {
  console.log("No source images found. Add files to ./sources/<object>/ or this folder root.");
  process.exit(0);
}

for (const img of files) {
  const base = outputBaseName(path.resolve(img));
  console.log(`Processing ${base}...`);

  for (let i = 0; i < widths.length; i += 1) {
    const width = widths[i];
    const label = labels[i];
    const out = outputPath(path.resolve(img), base, label);

    await sharp(img)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(out);
  }
}
