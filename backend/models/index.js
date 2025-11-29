import { readdirSync } from "fs";
import path from "path";
import url from "url";
import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const rootFile = url.fileURLToPath(import.meta.url);
const modelsDir = path.dirname(rootFile);

const dbName = process.env.DB_NAME || "wiki_app";
const dbUser = process.env.DB_USER || "postgres";
const dbPassword = process.env.DB_PASSWORD || "";
const dbHost = process.env.DB_HOST || "localhost";
const dbDialect = process.env.DB_DIALECT || "postgres";

const db = {};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
});

const modelFiles = readdirSync(modelsDir).filter(
  (file) => file !== "index.js" && file.endsWith(".js")
);

for (const file of modelFiles) {
  const modelPath = path.join(modelsDir, file);
  const moduleImport = await import(modelPath);
  const model = moduleImport.default;

  const modelInstance = model(sequelize, Sequelize.DataTypes);
  db[modelInstance.name] = modelInstance;
}

Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
