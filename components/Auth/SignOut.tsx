"use client";
import { logout } from "../../lib/auth";

export default function SignOutButton() {
  return (
    <button
      onClick={() => logout()}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
    >
      Sign out
    </button>
  );
}