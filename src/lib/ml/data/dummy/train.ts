// filepath: src/lib/ml/data/dummy/train.ts
import { DecisionTreeRegression as DTR } from "ml-cart";
import { writeFileSync } from "fs";
import { join } from "path";
import dataset from "./dataset.json";

const reg = new DTR({ maxDepth: 10, minNumSamples: 5 });
reg.train(dataset.trainingSet, dataset.trainingValues);
writeFileSync(join(__dirname, "../../model.json"), JSON.stringify(reg.toJSON(), null, 2));
console.log("model.json written. WARNING: trained on dummy data — replace before thesis submission.");
