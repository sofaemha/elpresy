import { Badge } from "@/components/ui/badge";
import { FolderX } from "lucide-react";

export default function DashboardArea({ t }: { t: any }) {
  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-display font-semibold text-white">{t("pageTitle")}</h3>
          <p className="text-[11px] text-text-faint mt-0.5">{t("pageSubtitle")}</p>
        </div>
        <Badge variant="outline" className="border-white/10 text-white/50 bg-white/5 text-[10px] px-2.5 py-0.5 rounded-full">
          Inactive
        </Badge>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center bg-[#111113] border border-white/[0.06] rounded-xl border-dashed">
        <div className="flex flex-col items-center text-center">
          <div className="size-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4">
            <FolderX className="text-text-faint" size={24} />
          </div>
          <h3 className="font-display font-semibold text-white mb-1">
            Belum ada fitur
          </h3>
          <p className="text-sm text-text-muted leading-relaxed max-w-sm">
            Halaman dashboard saat ini kosong.
          </p>
        </div>
      </div>
    </>
  );
}
