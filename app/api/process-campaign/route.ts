import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Load pdf-parse at runtime to avoid edge/runtime bundling issues.
  const pdfParse = eval("require")("pdf-parse");

  // Read the uploaded PDF file from multipart form-data.
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" });
  }

  // Convert PDF bytes into plain text rows.
  const buffer = Buffer.from(await file.arrayBuffer());

  const parsed = await pdfParse(buffer);

  const text: string = parsed.text;

  const rows: string[] = text.split("\n");
  console.log("TOTAL LINES:", rows.length);

  // Keep only observation rows that start with IU.
  const filtered = rows.filter((line: string) =>
    line.trim().match(/^IU/)
  );
  console.log("FILTERED IU ROWS:", filtered.length);

  // Ensure output directory exists before writing JSON files.
  const observationsDir = path.join(
    process.cwd(),
    "content/observations"
  );

  if (!fs.existsSync(observationsDir)) {
    fs.mkdirSync(observationsDir, { recursive: true });
  }

  let count = 0;

  for (const row of filtered) {
    // Tokenize each row and extract fields by positional layout.
    const tokens = row.trim().split(/\s+/);
    if (tokens.length < 7) continue;

    const id = tokens[0];
    const date = tokens[tokens.length - 2];
    const imageSet = tokens[tokens.length - 1];
    const status = tokens[tokens.length - 3];
    const country = tokens[tokens.length - 4];
    const team = tokens.slice(3, tokens.length - 4).join(" ");
    const observers = tokens
      .slice(1, 3)
      .join(" ")
      .split(",")
      .map((o: string) => o.trim());

    const observation = {
      id,
      observers,
      team,
      country,
      status,
      date,
      imageSet,
      campaign: "unknown"
    };

    // Write one observation payload per ID.
    const filePath = path.join(
      observationsDir,
      `${observation.id}.json`
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(observation, null, 2)
    );

    count++;

  }

  // Return both stored records and raw detected row count.
  return NextResponse.json({
    success: true,
    records: count,
    detectedRows: filtered.length
  });

}