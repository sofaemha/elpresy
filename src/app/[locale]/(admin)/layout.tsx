// filepath: src/app/[locale]/(admin)/layout.tsx
import Sidebar from "@/components/dashboard/layout/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen pt-14 lg:pt-0 lg:pl-16 min-w-0">
        {children}
      </div>
    </div>
  );
}
