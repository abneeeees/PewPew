"use client";

import Header from "./Global/Header";
import Sidebar from "./Global/Sidebar";
import { ReactNode, useState } from "react";

export default function AppShell({
  children,
  user
}: {
    children: React.ReactNode;
    user: ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header onMenuToggle={() => setIsMenuOpen((open) => !open)}>
        { user }
      </Header>
      
      <div className="flex flex-1">
        <Sidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <main className="min-w-0 flex-1 overflow-auto lg:ml-56">
          {children}
        </main>
      </div>

    </div>
  );
}