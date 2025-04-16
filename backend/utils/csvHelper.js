import { createReadStream } from "fs";
import { resolve as _resolve, dirname } from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getCsvAnswer(question) {
  return new Promise((resolve) => {
    const csvFilePath = _resolve(__dirname, "../data/chatbot.csv");
    console.log("🟡 [CSV] Searching for:", question);
    console.log("📁 Resolved CSV path:", csvFilePath);

    const stream = createReadStream(csvFilePath).pipe(csv());

    let found = false;

    stream.on("data", (row) => {
      console.log("📄 CSV Row:", row);
      if (row.Question?.trim().toLowerCase() === question.trim().toLowerCase()) {
        found = true;
        resolve(row.Answer || "No answer found in CSV.");
        stream.destroy(); // ✅ Stop reading once match is found
      }
    });

    stream.on("end", () => {
      if (!found) {
        console.log("🔴 [CSV] No match found.");
        resolve(null); // Let llamaHelper handle it if no match
      }
    });

    stream.on("error", (err) => {
      console.error("❌ Error reading CSV:", err);
      resolve(null);
    });
  });
}
