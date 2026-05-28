"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container">
      <Sidebar />
      <Header />
      {children}
    </div>
  );
}
