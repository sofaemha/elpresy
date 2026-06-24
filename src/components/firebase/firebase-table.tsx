"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface FirebaseDataRow {
  id: string;
  current: string | null;
  voltage: string | null;
  power_watt: string | null;
  last_updated: string | null;
  createdAt: Date | null;
}

interface FirebaseTableProps {
  data: FirebaseDataRow[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export default function FirebaseTable({ data, total, currentPage, totalPages }: FirebaseTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialSearch = searchParams.get("search") || "";
  const initialColumn = searchParams.get("column") || "current";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchColumn, setSearchColumn] = useState(initialColumn);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Sync to URL with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      let hasChanges = false;

      if (searchTerm !== (searchParams.get("search") || "")) {
        if (searchTerm) params.set("search", searchTerm);
        else params.delete("search");
        params.set("page", "1"); // Reset to first page on new search
        hasChanges = true;
      }

      if (searchColumn !== (searchParams.get("column") || "current")) {
        params.set("column", searchColumn);
        hasChanges = true;
      }

      if (hasChanges) {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 400); // 400ms debounce
    
    return () => clearTimeout(timer);
  }, [searchTerm, searchColumn, pathname, router, searchParams]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`${pathname}?${createQueryString("page", page.toString())}`, { scroll: false });
  };

  return (
    <div className="bg-surface border border-border-gold rounded-xl overflow-hidden mt-6">
      <div className="p-5 border-b border-border-gold flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-text-primary">Data Rekaman</h3>
          <p className="text-sm text-text-muted">Total {total} rekaman tersimpan.</p>
        </div>

        <div className="flex items-center gap-2">
          
          {/* Input Pencarian */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-text-faint" />
            </div>
            <input
              type="text"
              placeholder="Cari angka..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-9 pr-3 py-1 w-full sm:w-48 bg-surface-2 border border-border-gold rounded-md text-sm text-text-primary focus:outline-none focus:border-gold transition-colors placeholder:text-text-faint"
            />
          </div>

          {/* Dropdown Pemilih Kolom */}
          <select 
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="h-9 px-3 py-1 bg-surface-2 border border-border-gold rounded-md text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
          >
            <option value="current">Current (A)</option>
            <option value="voltage">Voltage (V)</option>
            <option value="powerWatt">Power (W)</option>
          </select>

        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-faint uppercase bg-surface-2 border-b border-border-gold">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">Waktu (Database)</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Sensor Time</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Current (A)</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Voltage (V)</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Power (W)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-gold/50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  {searchTerm ? "Tidak ada data yang cocok dengan pencarian Anda." : "Belum ada data yang direkam."}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const dbTime = row.createdAt ? format(new Date(row.createdAt), "dd MMM yyyy, HH:mm:ss", { locale: idLocale }) : "-";
                
                let sensorTime = "-";
                if (row.last_updated) {
                  const num = Number(row.last_updated);
                  if (!isNaN(num)) {
                    sensorTime = format(new Date(num * 1000), "HH:mm:ss");
                  }
                }

                return (
                  <tr key={row.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-text-primary">{dbTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-muted">{sensorTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-400">{row.current || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-400">{row.voltage || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-400">{row.power_watt || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="p-4 border-t border-border-gold flex items-center justify-between bg-surface-2/30">
          <span className="text-sm text-text-muted">
            Halaman <span className="font-semibold text-text-primary">{currentPage}</span> dari <span className="font-semibold text-text-primary">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded border border-border-gold text-text-muted hover:text-gold hover:border-gold disabled:opacity-50 disabled:hover:text-text-muted disabled:hover:border-border-gold transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border border-border-gold text-text-muted hover:text-gold hover:border-gold disabled:opacity-50 disabled:hover:text-text-muted disabled:hover:border-border-gold transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
