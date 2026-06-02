"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SessionItem = {
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
  };
  userName: string | null;
};

export function SessionsTable({ sessions }: { sessions: SessionItem[] }) {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["userName", "ipAddress", "userAgent", "date"]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredSessions = sessions.filter((s) => {
    const q = search.toLowerCase();
    if (!q) return true;

    return selectedColumns.some((col) => {
      const ip = s.session.ipAddress === "0000:0000:0000:0000:0000:0000:0000:0000" || s.session.ipAddress === "::1" ? "localhost" : (s.session.ipAddress || "");
      if (col === "userName") return (s.userName || "unknown").toLowerCase().includes(q);
      if (col === "ipAddress") return ip.toLowerCase().includes(q);
      if (col === "userAgent") return (s.session.userAgent || "").toLowerCase().includes(q);
      if (col === "date") return new Date(s.session.createdAt).toISOString().split("T")[0].includes(q);
      return false;
    });
  });

  const toggleColumn = (col: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, col]);
    } else {
      if (selectedColumns.length > 1) {
        setSelectedColumns(selectedColumns.filter((c) => c !== col));
      }
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, filteredSessions.length);
  const slice = filteredSessions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("tab_sessions")} ({filteredSessions.length})
        </h2>
        <div className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-text-faint" />
            </div>
            <input
              type="text"
              className="w-full h-9 bg-surface-2 border border-border rounded-lg pl-9 pr-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors placeholder:text-text-faint"
              placeholder={t("search_sessions")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 px-3 border border-border bg-surface-2 rounded-lg text-sm flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors whitespace-nowrap outline-none">
              <Filter size={14} /> Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-surface border border-border">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-text-primary">Search Columns</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("userName")}
                  onCheckedChange={(checked) => toggleColumn("userName", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  {t("col_user")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("ipAddress")}
                  onCheckedChange={(checked) => toggleColumn("ipAddress", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  {t("col_ip")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("userAgent")}
                  onCheckedChange={(checked) => toggleColumn("userAgent", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  {t("col_device")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("date")}
                  onCheckedChange={(checked) => toggleColumn("date", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  Date
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-2 text-text-muted text-xs border-b border-border">
            <tr>
              <th className="px-4 py-3">{t("col_user")}</th>
              <th className="px-4 py-3">{t("col_ip")}</th>
              <th className="px-4 py-3">{t("col_device")}</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {slice.map(({ session, userName }) => (
              <tr key={session.id} className="text-foreground">
                <td className="px-4 py-3">{userName || "Unknown"}</td>
                <td className="px-4 py-3 text-text-muted font-mono text-xs">
                  {session.ipAddress === "0000:0000:0000:0000:0000:0000:0000:0000" || session.ipAddress === "::1" ? "localhost" : (session.ipAddress || "N/A")}
                </td>
                <td className="px-4 py-3 text-text-muted text-xs">
                  <div className="max-w-[150px] sm:max-w-[200px] truncate" title={session.userAgent || ""}>
                    {session.userAgent || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(session.createdAt).toISOString().split("T")[0]}
                </td>
              </tr>
            ))}
            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  No sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredSessions.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface-2 shrink-0 gap-4 flex-wrap rounded-b-xl">
            <p className="text-[11px] text-text-faint font-mono">
              Showing {from} to {to} of {filteredSessions.length} entries
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={13} aria-hidden="true" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`inline-flex items-center justify-center size-6 rounded text-[11px] font-mono transition-all border ${
                    p === page
                      ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                      : "border-border text-text-faint hover:border-primary/30 hover:text-text-muted"
                  }`}
                >
                  {p}
                </button>
              ))}

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight size={13} aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
