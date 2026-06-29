"use client";

import Link from "next/link";
import { menuItems } from "../../lib/Data";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps,) {

  const pathname = usePathname();
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 -z-10 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 flex w-56 flex-col border-r border-border bg-surface transition-transform duration-200 lg:static lg:top-0 lg:z-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent text-white transition-colors hover:bg-accent-hover"
                    : "text-muted hover:bg-surface-raised hover:text-accent"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
