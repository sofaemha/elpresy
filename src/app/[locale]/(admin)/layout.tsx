// filepath: src/app/[locale]/(admin)/layout.tsx
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-bg">
      {children}
    </div>
  );
}
