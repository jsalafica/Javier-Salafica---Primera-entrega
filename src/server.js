import express, { json, urlencoded } from "express";
import router from "./routes/router.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/", router);

const PORT = 8080;
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: " + error);
  } else {
    console.log("Server listening on port", PORT);
  }
});
