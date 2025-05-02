import { createReadStream,existsSync } from "fs";
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

    // Check if CSV file exists
    if (!existsSync(csvFilePath)) {
      console.error("❌ CSV file not found at:", csvFilePath);
      resolve(null);
      return;
    }

    // Handle generic greetings
    const userQuestion = question.trim().toLowerCase().replace(/[!?.]/g, "");
    if (["hi", "hello", "hey"].includes(userQuestion)) {
      console.log("✅ Handling generic greeting");
      resolve("Hello! I'm FinBot, your Finance Assistant. How can I help with your financial queries?");
      return;
    }

    const stream = createReadStream(csvFilePath).pipe(csv());
    let found = false;

    stream.on("data", (row) => {
      console.log("📄 CSV Row:", row);
      const csvQuestion = row.query?.trim().toLowerCase();

      if (csvQuestion && csvQuestion.includes(userQuestion)) {
        found = true;
        console.log("✅ Match found in CSV!");
        resolve(row.response || "No answer found in CSV.");
        stream.destroy();
      }
    });

    stream.on("end", () => {
      if (!found) {
        console.log(`🔴 [CSV] No match found for query: "${question}"`);
        resolve(null);
      }
    });

    stream.on("error", (err) => {
      console.error("❌ Error reading CSV:", err);
      resolve(null);
    });
  });
}