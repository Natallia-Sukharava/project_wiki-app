import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

export function readAll() {
  const files = fs.readdirSync(dataPath);
  return files.map((file) => {
    const content = fs.readFileSync(path.join(dataPath, file), "utf-8");
    return JSON.parse(content);
  });
}

export function readOne(id) {
  const filePath = path.join(dataPath, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

export function saveArticle(title, content) {
  const id = Date.now().toString();
  const article = { id, title, content, createdAt: new Date() };
  fs.writeFileSync(
    path.join(dataPath, `${id}.json`),
    JSON.stringify(article, null, 2)
  );
  return article;
}
