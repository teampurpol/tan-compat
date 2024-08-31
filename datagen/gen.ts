import * as fs from "node:fs";
import * as path from "node:path";
import { parseCSV } from "./utils";

const allowedThirstValues = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];

const allowedHydrationValues = ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];

const tagFiles: { path: string; tags: string[] }[] = [];

function addTag(file: string, tag: string) {
  if (!tagFiles.find((tagFile) => tagFile.path === file)) {
    tagFiles.push({
      path: file,
      tags: [tag],
    });
  } else {
    tagFiles.find((tagFile) => tagFile.path === file)?.tags.push(tag);
  }
}

const drinksCsv = fs.readFileSync(path.join("..", "drinks.csv"), "utf-8");
const drinks = parseCSV(drinksCsv);

const immersiveBlocksCsv = fs.readFileSync(path.join("..", "immersive_blocks.csv"), "utf-8");
const immersiveBlocks = parseCSV(immersiveBlocksCsv);

drinks.forEach((drink) => {
  if (drink["thirst"] && allowedThirstValues.includes(drink["thirst"])) {
    addTag(`toughasnails/tags/items/thirst/${drink["thirst"]}_thirst_drinks.json`, drink["item"]);
  }

  if (drink["hydration"] && allowedHydrationValues.includes(drink["hydration"])) {
    addTag(`toughasnails/tags/items/hydration/${drink["hydration"]}_hydration_drinks.json`, drink["item"]);
  }
});

immersiveBlocks.forEach((block) => {
  if (block["type"] === "heating") {
    addTag("toughasnails/tags/blocks/heating_blocks.json", block["block"]);
  } else if (block["type"] === "cooling") {
    addTag("toughasnails/tags/blocks/cooling_blocks.json", block["block"]);
  }
});

tagFiles.forEach((tagFile) => {
  const pathRoot = tagFile.path.split("/").slice(0, -1).join("/");
  if (!fs.existsSync(path.join("out", pathRoot))) {
    fs.mkdirSync(path.join("out", pathRoot), { recursive: true });
  }
  writeFile(
    tagFile.path,
    JSON.stringify({ replace: false, values: tagFile.tags.map((t) => ({ id: t, required: false })) }, null, 2),
  );
});

function writeFile(p: string, content: string) {
  const paths = [path.join("..", "forge", "src", "main", "resources", "data", p)];

  paths.forEach((path) => {
    const pathRoot = path.split("/").slice(0, -1).join("/");
    if (!fs.existsSync(pathRoot)) {
      fs.mkdirSync(pathRoot, { recursive: true });
    }
    fs.writeFileSync(path, content);
  });
}
