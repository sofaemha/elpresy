import { getPredictions } from "@/app/actions/predictions";
import HistoryClient from "./history-client";

export default async function HistoryPage() {
  const predictions = await getPredictions();

  return (
    <HistoryClient initialPredictions={predictions} />
  );
}
