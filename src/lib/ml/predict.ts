// filepath: src/lib/ml/predict.ts
import { DecisionTreeRegression as DTR } from "ml-cart";
import modelJSON from "./model.json";

export interface ChartDataPoint { day: number; ampere: number; }
export interface PredictionResult {
  chartData: ChartDataPoint[];
  resultLower: number;
  resultUpper: number;
  totalAmpere: number;
}

const reg = DTR.load(modelJSON as any);

export function runPrediction(
  amperePerCycle: number,
  dailyUsageHours: number,
  predictionPeriod: number
): PredictionResult {
  const inputMatrix = Array.from({ length: predictionPeriod }, (_, i) => [
    amperePerCycle, dailyUsageHours, i,
  ]);
  const predictions = reg.predict(inputMatrix) as number[];
  const resultLower = parseFloat((Math.min(...predictions) * 0.9).toFixed(3));
  const resultUpper = parseFloat((Math.max(...predictions) * 1.1).toFixed(3));
  const chartData   = predictions.map((v, i) => ({ day: i + 1, ampere: parseFloat(v.toFixed(3)) }));
  const totalAmpere = parseFloat(chartData.reduce((sum, p) => sum + p.ampere, 0).toFixed(3));
  return { chartData, resultLower, resultUpper, totalAmpere };
}
