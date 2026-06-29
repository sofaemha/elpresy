"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Filter, CalendarIcon, Activity, Database, Zap, Plug } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

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
  stats: {
    minCurrent: number;
    maxCurrent: number;
    minVoltage: number;
    maxVoltage: number;
    minPower: number;
    maxPower: number;
  };
  summary: {
    avgCurrent: string;
    avgVoltage: string;
    avgPower: string;
  };
  activeDates?: string[];
}

export default function FirebaseTable({ data, total, currentPage, totalPages, stats, summary, activeDates = [] }: FirebaseTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialDateStr = searchParams.get("date");
  const getInitialDateRange = (): DateRange | undefined => {
    if (!initialDateStr) return undefined;
    const parts = initialDateStr.split(",");
    if (parts.length === 1) {
      return { from: new Date(`${parts[0]}T00:00:00`), to: new Date(`${parts[0]}T00:00:00`) };
    }
    if (parts.length === 2) {
      return { from: new Date(`${parts[0]}T00:00:00`), to: new Date(`${parts[1]}T00:00:00`) };
    }
    return undefined;
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(getInitialDateRange());

  const parseRange = (param: string | null, min: number, max: number) => {
    if (!param) return [min, max];
    const parts = param.split("-").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return [min, max];
  };

  const [currentRange, setCurrentRange] = useState<number[]>(
    parseRange(searchParams.get("current"), stats.minCurrent, stats.maxCurrent)
  );
  const [voltageRange, setVoltageRange] = useState<number[]>(
    parseRange(searchParams.get("voltage"), stats.minVoltage, stats.maxVoltage)
  );
  const [powerRange, setPowerRange] = useState<number[]>(
    parseRange(searchParams.get("power"), stats.minPower, stats.maxPower)
  );

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
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      let hasChanges = false;

      const updateParam = (key: string, min: number, max: number, defaultMin: number, defaultMax: number) => {
        const val = `${min}-${max}`;
        if (min !== defaultMin || max !== defaultMax) {
          if (params.get(key) !== val) {
            params.set(key, val);
            hasChanges = true;
          }
        } else {
          if (params.has(key)) {
            params.delete(key);
            hasChanges = true;
          }
        }
      };

      updateParam("current", currentRange[0], currentRange[1], stats.minCurrent, stats.maxCurrent);
      updateParam("voltage", voltageRange[0], voltageRange[1], stats.minVoltage, stats.maxVoltage);
      updateParam("power", powerRange[0], powerRange[1], stats.minPower, stats.maxPower);

      if (dateRange?.from) {
        let dateStr = format(dateRange.from, "yyyy-MM-dd");
        if (dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()) {
          dateStr += `,${format(dateRange.to, "yyyy-MM-dd")}`;
        }
        
        if (params.get("date") !== dateStr) {
          params.set("date", dateStr);
          hasChanges = true;
        }
      } else {
        if (params.has("date")) {
          params.delete("date");
          hasChanges = true;
        }
      }

      if (hasChanges) {
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 400); 
    
  }, [
    currentRange, voltageRange, powerRange, dateRange, pathname, router, searchParams, 
    stats.minCurrent, stats.maxCurrent, stats.minVoltage, stats.maxVoltage, stats.minPower, stats.maxPower
  ]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`${pathname}?${createQueryString("page", page.toString())}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Separator from Live Monitoring */}

      {/* Summary Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-display font-semibold text-text-primary">Ringkasan Data</h3>
          <p className="text-sm text-text-muted mt-1">Kalkulasi rata-rata dari seluruh data yang telah disaring.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 shadow-lg relative overflow-hidden group transition-colors duration-300 hover:border-gold">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 text-text-faint relative z-10">
              <Database size={16} className="text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Data</span>
            </div>
            <div className="text-2xl font-display font-bold text-white relative z-10">{total}</div>
          </div>
          <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 shadow-lg relative overflow-hidden group transition-colors duration-300 hover:border-gold">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 text-text-faint relative z-10">
              <Activity size={16} className="text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Avg. Current</span>
            </div>
            <div className="text-2xl font-display font-bold text-text-primary relative z-10">{summary.avgCurrent} <span className="text-sm font-normal text-text-muted">A</span></div>
          </div>
          <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 shadow-lg relative overflow-hidden group transition-colors duration-300 hover:border-gold">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 text-text-faint relative z-10">
              <Zap size={16} className="text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Avg. Voltage</span>
            </div>
            <div className="text-2xl font-display font-bold text-text-primary relative z-10">{summary.avgVoltage} <span className="text-sm font-normal text-text-muted">V</span></div>
          </div>
          <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 shadow-lg relative overflow-hidden group transition-colors duration-300 hover:border-gold">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 text-text-faint relative z-10">
              <Plug size={16} className="text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Avg. Power Watt</span>
            </div>
            <div className="text-2xl font-display font-bold text-text-primary relative z-10">{summary.avgPower} <span className="text-sm font-normal text-text-muted">W</span></div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border-gold rounded-xl overflow-hidden mt-2">
        <div className="p-5 border-b border-border-gold flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-text-primary">Data Rekaman</h3>
          <p className="text-sm text-text-muted">Total {total} rekaman tersimpan.</p>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-3">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger className={cn(
              "flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border-gold rounded-md text-sm transition-colors focus:outline-none",
              dateRange?.from ? "text-text-primary hover:border-gold" : "text-text-muted hover:text-text-primary hover:border-gold"
            )}>
              <CalendarIcon size={16} className={dateRange?.from ? "text-gold" : ""} />
              <span>
                {dateRange?.from ? (
                  dateRange.to ? (
                    dateRange.from.getTime() === dateRange.to.getTime() 
                      ? format(dateRange.from, "PPP", { locale: idLocale })
                      : `${format(dateRange.from, "dd MMM", { locale: idLocale })} - ${format(dateRange.to, "dd MMM", { locale: idLocale })}`
                  ) : (
                    format(dateRange.from, "PPP", { locale: idLocale })
                  )
                ) : (
                  "Pilih Tanggal"
                )}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-surface border border-border-gold rounded-xl shadow-xl flex flex-col sm:flex-row" align="end">
              <div className="flex flex-col gap-1 p-3 border-b sm:border-b-0 sm:border-r border-border-gold min-w-[150px]">
                <button 
                  onClick={() => setDateRange({ from: new Date(), to: new Date() })} 
                  className="text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-2 hover:text-gold rounded-md transition-colors"
                >
                  Hari Ini
                </button>
                <button 
                  onClick={() => {
                    const to = new Date();
                    const from = new Date();
                    from.setDate(from.getDate() - 29);
                    setDateRange({ from, to });
                  }} 
                  className="text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-2 hover:text-gold rounded-md transition-colors"
                >
                  30 Hari Terakhir
                </button>
                <button 
                  onClick={() => {
                    const to = new Date();
                    const from = new Date();
                    from.setDate(from.getDate() - 59);
                    setDateRange({ from, to });
                  }} 
                  className="text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-2 hover:text-gold rounded-md transition-colors"
                >
                  60 Hari Terakhir
                </button>
                <button 
                  onClick={() => {
                    const to = new Date();
                    const from = new Date();
                    from.setDate(from.getDate() - 89);
                    setDateRange({ from, to });
                  }} 
                  className="text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-2 hover:text-gold rounded-md transition-colors"
                >
                  90 Hari Terakhir
                </button>
                <button 
                  onClick={() => setDateRange(undefined)} 
                  className="text-left px-3 py-2 text-sm text-text-muted hover:text-red-500 hover:bg-surface-2 rounded-md transition-colors mt-auto pt-2 border-t border-border-gold"
                >
                  Reset Tanggal
                </button>
              </div>
              <div className="p-2">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  className="bg-surface text-text-primary"
                  modifiers={{
                    hasData: activeDates.map(d => new Date(`${d}T00:00:00`))
                  }}
                  modifiersClassNames={{
                    hasData: "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-white"
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border-gold rounded-md text-sm text-text-primary hover:border-gold transition-colors focus:outline-none">
              <Filter size={16} className="text-gold" />
              <span>Filter Data</span>
            </PopoverTrigger>
          <PopoverContent align="end" className="w-[320px] p-5 bg-surface border border-border-gold rounded-xl shadow-xl">
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Filter Rekaman</h4>
                <p className="text-xs text-text-muted">Sesuaikan batas nilai untuk menyaring data.</p>
              </div>

              {/* Filter Sliders */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">Current (A)</span>
                    <span className="text-text-primary bg-surface-2 px-2 py-0.5 rounded border border-border-gold/50">{currentRange[0]} - {currentRange[1]}</span>
                  </div>
                  <Slider
                    min={stats.minCurrent}
                    max={stats.maxCurrent}
                    step={0.1}
                    value={currentRange}
                    onValueChange={setCurrentRange}
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">Voltage (V)</span>
                    <span className="text-text-primary bg-surface-2 px-2 py-0.5 rounded border border-border-gold/50">{voltageRange[0]} - {voltageRange[1]}</span>
                  </div>
                  <Slider
                    min={stats.minVoltage}
                    max={stats.maxVoltage}
                    step={1}
                    value={voltageRange}
                    onValueChange={setVoltageRange}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">Power (W)</span>
                    <span className="text-text-primary bg-surface-2 px-2 py-0.5 rounded border border-border-gold/50">{powerRange[0]} - {powerRange[1]}</span>
                  </div>
                  <Slider
                    min={stats.minPower}
                    max={stats.maxPower}
                    step={1}
                    value={powerRange}
                    onValueChange={setPowerRange}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
                  Belum ada data yang direkam atau cocok dengan filter.
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const dbTime = row.createdAt ? format(new Date(row.createdAt), "dd/MM/yyyy'T'HH:mm:ss", { locale: idLocale }) : "-";
                
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
    </div>
  );
}
