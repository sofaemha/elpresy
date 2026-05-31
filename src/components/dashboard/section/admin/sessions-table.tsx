"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

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

  const filteredSessions = sessions.filter((s) => {
    const q = search.toLowerCase();
    const name = s.userName || "unknown";
    const ip = s.session.ipAddress || "";
    const agent = s.session.userAgent || "";
    return (
      name.toLowerCase().includes(q) ||
      ip.toLowerCase().includes(q) ||
      agent.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("tab_sessions")} ({filteredSessions.length})
        </h2>
        <div className="relative max-w-sm w-full">
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
            {filteredSessions.map(({ session, userName }) => (
              <tr key={session.id} className="text-foreground">
                <td className="px-4 py-3">{userName || "Unknown"}</td>
                <td className="px-4 py-3 text-text-muted font-mono text-xs">
                  {session.ipAddress || "N/A"}
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
      </div>
    </div>
  );
}
