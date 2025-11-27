import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import configFile from "../config/config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = "development";
const config = configFile[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const files = readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== "index.js" &&
      file.slice(-3) === ".js"
  );


for (const file of files) {
  const modelPath = path.join(__dirname, file);
  const model = (await import(modelPath)).default;
  const modelInstance = model(sequelize, Sequelize.DataTypes);
  db[modelInstance.name] = modelInstance;
}


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
