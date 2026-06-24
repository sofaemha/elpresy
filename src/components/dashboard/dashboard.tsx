"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/dashboard/section/header";
import { FolderX } from "lucide-react";

export default function DashboardShell() {
  const t = useTranslations("dashboard");

  return (
    <main className="flex-1 flex flex-col gap-6 px-5 md:px-8 py-7 max-w-screen-xl w-full mx-auto">
      {/* Page header */}
      <Header t={t} totalCount={0} />

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[440px] bg-surface border border-border-gold rounded-lg border-dashed">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="size-12 rounded-full bg-surface-2 flex items-center justify-center border border-border-gold mb-4">
            <FolderX className="text-text-faint" size={24} />
          </div>
          <h3 className="font-display font-semibold text-text-primary mb-1">
            Belum ada fitur
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            Halaman dashboard saat ini kosong karena fitur telah dipindahkan.
          </p>
        </div>
      </div>
    </main>
  );
}
