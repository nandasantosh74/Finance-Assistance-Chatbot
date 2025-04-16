import { createReadStream } from "fs";
import { resolve as _resolve } from "path";
import csv from "csv-parser";

function getCsvAnswer(question) {
  return new Promise((resolve) => {
    const csvFilePath = _resolve(__dirname, "data", "chatbot.csv"); // ✅ RELATIVE path works on Render
    console.log("🟡 [CSV] Searching for:", question);
    
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

export default { getCsvAnswer };
