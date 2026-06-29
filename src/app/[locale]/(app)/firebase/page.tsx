import { getTranslations } from "next-intl/server";
import FirebaseMonitor from "@/components/firebase/firebase-monitor";
import FirebaseTable from "@/components/firebase/firebase-table";
import { db } from "@/lib/db";
import { firebaseData } from "@/lib/db/schema";
import { desc, count, min, max, and, gte, lte, sql, or, avg } from "drizzle-orm";

export default async function FirebasePage(props: {
  searchParams: Promise<{
    page?: string;
    date?: string;
    minCurrent?: string; maxCurrent?: string;
    minVoltage?: string; maxVoltage?: string;
    minPower?: string; maxPower?: string;
  }>
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("dashboard");

  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const minC = searchParams.minCurrent ? Number(searchParams.minCurrent) : undefined;
  const maxC = searchParams.maxCurrent ? Number(searchParams.maxCurrent) : undefined;
  const minV = searchParams.minVoltage ? Number(searchParams.minVoltage) : undefined;
  const maxV = searchParams.maxVoltage ? Number(searchParams.maxVoltage) : undefined;
  const minP = searchParams.minPower ? Number(searchParams.minPower) : undefined;
  const maxP = searchParams.maxPower ? Number(searchParams.maxPower) : undefined;
  const dateStrs = searchParams.date ? searchParams.date.split(",") : [];

  const dateConditions = [];
  if (dateStrs.length > 0) {
    if (dateStrs.length === 1) {
      const startOfDay = new Date(`${dateStrs[0]}T00:00:00.000`);
      const endOfDay = new Date(`${dateStrs[0]}T23:59:59.999`);
      dateConditions.push(and(gte(firebaseData.createdAt, startOfDay), lte(firebaseData.createdAt, endOfDay)));
    } else if (dateStrs.length === 2) {
      const startOfDay = new Date(`${dateStrs[0]}T00:00:00.000`);
      const endOfDay = new Date(`${dateStrs[1]}T23:59:59.999`);
      dateConditions.push(and(gte(firebaseData.createdAt, startOfDay), lte(firebaseData.createdAt, endOfDay)));
    }
  }

  const conditions = [...dateConditions];
  if (minC !== undefined) conditions.push(gte(firebaseData.current, minC));
  if (maxC !== undefined) conditions.push(lte(firebaseData.current, maxC));
  if (minV !== undefined) conditions.push(gte(firebaseData.voltage, minV));
  if (maxV !== undefined) conditions.push(lte(firebaseData.voltage, maxV));
  if (minP !== undefined) conditions.push(gte(firebaseData.powerWatt, minP));
  if (maxP !== undefined) conditions.push(lte(firebaseData.powerWatt, maxP));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const dateWhereClause = dateConditions.length > 0 ? and(...dateConditions) : undefined;

  // Fetch min/max stats for the sliders
  const [statsRes] = await db
    .select({
      minCurrent: min(firebaseData.current),
      maxCurrent: max(firebaseData.current),
      minVoltage: min(firebaseData.voltage),
      maxVoltage: max(firebaseData.voltage),
      minPower: min(firebaseData.powerWatt),
      maxPower: max(firebaseData.powerWatt),
    })
    .from(firebaseData)
    .where(dateWhereClause);

  const stats = {
    minCurrent: statsRes?.minCurrent ?? 0,
    maxCurrent: statsRes?.maxCurrent ?? 10,
    minVoltage: statsRes?.minVoltage ?? 0,
    maxVoltage: statsRes?.maxVoltage ?? 250,
    minPower: statsRes?.minPower ?? 0,
    maxPower: statsRes?.maxPower ?? 2500,
  };

  // Fetch active dates
  const datesRes = await db
    .select({
      date: sql<string>`TO_CHAR("createdAt", 'YYYY-MM-DD')`,
    })
    .from(firebaseData)
    .groupBy(sql`TO_CHAR("createdAt", 'YYYY-MM-DD')`);
  const activeDates = datesRes.map((r) => r.date);

  // Fetch total matching records
  const [totalRes] = await db
    .select({ count: count() })
    .from(firebaseData)
    .where(whereClause);

  const totalRows = totalRes.count;
  const totalPages = Math.ceil(totalRows / limit);

  // Fetch paginated data
  const rawData = await db
    .select()
    .from(firebaseData)
    .where(whereClause)
    .orderBy(desc(firebaseData.createdAt))
    .limit(limit)
    .offset(offset);

  const mappedData = rawData.map((r) => ({
    id: r.id,
    current: r.current?.toString() || "-",
    voltage: r.voltage?.toString() || "-",
    power_watt: r.powerWatt?.toString() || "-",
    last_updated: r.lastUpdated?.toString() || "-",
    createdAt: r.createdAt,
  }));

  // Fetch summary stats for filtered data
  const [summaryRes] = await db
    .select({
      avgCurrent: avg(firebaseData.current),
      avgVoltage: avg(firebaseData.voltage),
      avgPower: avg(firebaseData.powerWatt),
    })
    .from(firebaseData)
    .where(whereClause);

  const summary = {
    avgCurrent: summaryRes?.avgCurrent ? Number(summaryRes.avgCurrent).toFixed(2) : "0.00",
    avgVoltage: summaryRes?.avgVoltage ? Number(summaryRes.avgVoltage).toFixed(2) : "0.00",
    avgPower: summaryRes?.avgPower ? Number(summaryRes.avgPower).toFixed(2) : "0.00",
  };

  return (
    <main className="p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
          Firebase Monitor
        </h1>
        <p className="text-text-muted">
          Pusat pemantauan perangkat IoT dan manajemen data mentah secara real-time.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FirebaseMonitor />
        <hr className="border-gold border-t my-10 opacity-50" />
        <FirebaseTable
          data={mappedData}
          total={totalRows}
          currentPage={page}
          totalPages={totalPages}
          stats={stats}
          summary={summary}
          activeDates={activeDates}
        />
      </div>
    </main>
  );
}
