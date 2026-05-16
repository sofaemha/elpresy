export default function Powered({ t }: { t: any }) {
  return (
    <div className="mt-20 text-center">
      <p className="inline-block px-6 py-2 rounded-full bg-surface-2 border border-border text-sm text-text-faint font-mono">
        {t("poweredBy")}
      </p>
    </div>
  );
}
