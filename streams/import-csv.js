import { parse } from "csv-parse";
import fs from "node:fs";

export async function loadTasks() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(new URL("tasks.csv", import.meta.url))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(data);
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      })
      .on("end", () => {
        console.log("End");
        resolve();
      });
  });
}

await loadTasks();
