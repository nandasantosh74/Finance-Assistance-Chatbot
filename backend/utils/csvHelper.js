import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

// Remove this line ❌
// import { getCsvAnswer } from "./utils/csvHelper.js";

export const getCsvAnswer = async (question) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvFilePath = path.join("C:", "Users", "nanda", "fac", "backend", "data", "chatbot.csv");

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row) => results.push(row))
      .on("end", () => {
        const match = results.find((r) => r.query.toLowerCase() === question.toLowerCase());
        resolve(match ? match.response : null);
      })
      .on("error", (err) => reject(err));
  });
};
