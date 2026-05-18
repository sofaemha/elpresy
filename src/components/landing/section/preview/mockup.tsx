import App from "@/components/landing/section/preview/app";

export default function Mockup() {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Gold glow behind frame */}
      <div className="absolute -inset-4 bg-gold/[0.04] blur-[60px] rounded-[3rem] pointer-events-none" />

      <div
        className="relative rounded-2xl border border-white/[0.08] bg-[#0a0a0c] overflow-hidden"
        style={{ boxShadow: "0 0 80px rgba(201,168,76,0.08), 0 25px 50px rgba(0,0,0,0.5)" }}
      >
        {/* Browser Chrome */}
        <div className="h-11 bg-[#111113] border-b border-white/[0.06] flex items-center px-4 gap-4 shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-[26px] bg-black/40 rounded-md border border-white/[0.06] flex items-center justify-center gap-1.5 px-3">
              <div className="w-3 h-3 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] text-text-muted font-mono">elpresy.app/dashboard</span>
            </div>
          </div>
          <div className="w-14" />
        </div>

        {/* App */}
        <App />
      </div>
    </div>
  );
}
