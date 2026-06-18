// filepath: src/lib/ml/evaluate.ts
import { DecisionTreeRegression as DTR } from "ml-cart";
import dataset from "./data/dummy/dataset.json";

export interface EvaluationResult {
  mse: number;
  mae: number;
  rmse: number;
  r2: number;
  sampleCount: number;
  trainSize: number;
  testSize: number;
  meanActual: number;
}

export interface Dataset {
  trainingSet: number[][];
  trainingValues: number[];
}

export function computeMSE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < actual.length; i++) {
    sum += Math.pow(actual[i] - predicted[i], 2);
  }
  return sum / actual.length;
}

export function computeMAE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < actual.length; i++) {
    sum += Math.abs(actual[i] - predicted[i]);
  }
  return sum / actual.length;
}

export function computeRMSE(actual: number[], predicted: number[]): number {
  return Math.sqrt(computeMSE(actual, predicted));
}

export function computeR2(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) return 0;
  const meanActual = actual.reduce((sum, val) => sum + val, 0) / actual.length;
  
  let ssRes = 0; // Residual sum of squares
  let ssTot = 0; // Total sum of squares
  
  for (let i = 0; i < actual.length; i++) {
    ssRes += Math.pow(actual[i] - predicted[i], 2);
    ssTot += Math.pow(actual[i] - meanActual, 2);
  }
  
  if (ssTot === 0) return 1; // Avoid division by zero
  return 1 - (ssRes / ssTot);
}

export function splitDataset(
  dataset: Dataset,
  trainRatio: number
): { train: Dataset; test: Dataset } {
  const totalLength = dataset.trainingSet.length;
  const trainSize = Math.floor(totalLength * trainRatio);
  
  return {
    train: {
      trainingSet: dataset.trainingSet.slice(0, trainSize),
      trainingValues: dataset.trainingValues.slice(0, trainSize),
    },
    test: {
      trainingSet: dataset.trainingSet.slice(trainSize),
      trainingValues: dataset.trainingValues.slice(trainSize),
    },
  };
}

export function evaluateModel(): EvaluationResult {
  const totalSamples = dataset.trainingSet.length;
  const { train, test } = splitDataset(dataset, 0.7);
  
  // Train the model
  const reg = new DTR({ maxDepth: 10, minNumSamples: 5 });
  reg.train(train.trainingSet, train.trainingValues);
  
  // Predict on test set
  const predicted = reg.predict(test.trainingSet) as number[];
  const actual = test.trainingValues;
  
  const mse = computeMSE(actual, predicted);
  const mae = computeMAE(actual, predicted);
  const rmse = computeRMSE(actual, predicted);
  const r2 = computeR2(actual, predicted);
  
  const meanActual = actual.reduce((sum, val) => sum + val, 0) / actual.length;
  
  return {
    mse: parseFloat(mse.toFixed(4)),
    mae: parseFloat(mae.toFixed(4)),
    rmse: parseFloat(rmse.toFixed(4)),
    r2: parseFloat(r2.toFixed(4)),
    sampleCount: totalSamples,
    trainSize: train.trainingSet.length,
    testSize: test.trainingSet.length,
    meanActual: parseFloat(meanActual.toFixed(4)),
  };
}
