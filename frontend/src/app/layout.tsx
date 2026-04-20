import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";  // ← agregar
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Viajes Altairis",
  description: "Panel de administración",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Toaster position="top-right" />
        <div className="h-full relative">
          {/* Sidebar fijo a la izquierda */}
          <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
            <Sidebar />
          </div>

          {/* Contenido principal con margen */}
          <main className="md:pl-72">
            <div className="min-h-screen bg-slate-50">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}