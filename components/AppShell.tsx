"use client";

import Header from "./Global/Header";
import Footer from "./Global/Footer";
import Sidebar from "./Global/Sidebar";
import { useState } from "react";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header onMenuToggle={() => setIsMenuOpen((open) => !open)} />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <main className="min-w-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/*<Footer />*/}
    </div>
  );
}