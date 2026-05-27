// filepath: src/app/[locale]/(app)/layout.tsx
import Sidebar from "@/components/dashboard/layout/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      {/* lg:pl-64 offsets the fixed 256px sidebar on desktop */}
      {/* pt-14 offsets the fixed mobile top bar on small screens */}
      <div className="flex-1 flex flex-col min-h-screen pt-14 lg:pt-0 lg:pl-64">
        {children}
      </div>
    </div>
  );
}
