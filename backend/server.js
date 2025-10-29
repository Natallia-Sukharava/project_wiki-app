import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import articlesRouter from "./routes/articles.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/articles", articlesRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});