import { getTranslations } from "next-intl/server";
import FirebaseMonitor from "@/components/firebase/firebase-monitor";
import FirebaseTable from "@/components/firebase/firebase-table";
import { db } from "@/lib/db";
import { firebaseData } from "@/lib/db/schema";
import { desc, count, sql, like } from "drizzle-orm";

export default async function FirebasePage(props: { searchParams: Promise<{ page?: string; search?: string; column?: string }> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("dashboard");

  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const column = searchParams.column || "current";
  const limit = 10;
  const offset = (page - 1) * limit;

  // Construct dynamic where clause for search
  let whereClause = undefined;
  if (search) {
    if (column === "current") {
      whereClause = like(sql`CAST(${firebaseData.current} AS TEXT)`, `%${search}%`);
    } else if (column === "voltage") {
      whereClause = like(sql`CAST(${firebaseData.voltage} AS TEXT)`, `%${search}%`);
    } else if (column === "powerWatt") {
      whereClause = like(sql`CAST(${firebaseData.powerWatt} AS TEXT)`, `%${search}%`);
    }
  }

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
        <FirebaseTable 
          data={mappedData} 
          total={totalRows}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}
