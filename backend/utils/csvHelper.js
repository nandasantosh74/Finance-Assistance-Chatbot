const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function getCsvAnswer(question) {
  return new Promise((resolve) => {
    const csvFilePath = path.resolve(__dirname, "data", "chatbot.csv"); // ✅ RELATIVE path works on Render
    console.log("🟡 [CSV] Searching for:", question);
    
    const stream = fs.createReadStream(csvFilePath).pipe(csv());

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

module.exports = { getCsvAnswer };
