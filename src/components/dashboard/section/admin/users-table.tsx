"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export function UsersTable({ users }: { users: User[] }) {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["name", "email", "role", "registered"]);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    if (!q) return true;
    
    return selectedColumns.some((col) => {
      if (col === "registered") {
        return new Date(u.createdAt).toISOString().split("T")[0].includes(q);
      }
      const val = u[col as keyof User];
      if (typeof val === "string") {
        return val.toLowerCase().includes(q);
      }
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("tab_users")} ({filteredUsers.length})
        </h2>
        <div className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-text-faint" />
            </div>
            <input
              type="text"
              className="w-full h-9 bg-surface-2 border border-border rounded-lg pl-9 pr-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors placeholder:text-text-faint"
              placeholder={t("search_users")}
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
                {["name", "email", "role"].map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col}
                    checked={selectedColumns.includes(col)}
                    onCheckedChange={(checked) => toggleColumn(col, checked)}
                    className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                  >
                    {t(`col_${col}`)}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("registered")}
                  onCheckedChange={(checked) => toggleColumn("registered", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  {t("col_registered")}
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
              <th className="px-4 py-3">{t("col_name")}</th>
              <th className="px-4 py-3">{t("col_email")}</th>
              <th className="px-4 py-3">{t("col_role")}</th>
              <th className="px-4 py-3">{t("col_registered")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-foreground">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                      user.role === "admin"
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(user.createdAt).toISOString().split("T")[0]}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
