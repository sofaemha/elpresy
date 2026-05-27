// filepath: src/lib/ml/data/dummy/generate.ts
import { writeFileSync } from "fs";
import { join } from "path";

function rand(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(3));
}

const trainingSet: number[][] = [];
const trainingValues: number[] = [];

for (let i = 0; i < 100; i++) {
  const a = rand(5, 25), h = rand(1, 16), t = i % 30;
  trainingSet.push([a, h, t]);
  trainingValues.push(parseFloat((a * 0.6 + h * 0.3 + t * 0.1 + rand(-0.5, 0.5)).toFixed(3)));
}

writeFileSync(join(__dirname, "dataset.json"), JSON.stringify({ trainingSet, trainingValues }, null, 2));
console.log("Generated 100 dummy samples. WARNING: delete when real data is available.");
