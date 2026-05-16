export default function Header({ t }: { t: any }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-20">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
        {t("heading")}
      </h2>
      <p className="text-lg text-text-muted">
        {t("subheading")}
      </p>
    </div>
  );
}
