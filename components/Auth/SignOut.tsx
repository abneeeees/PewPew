"use client";

import { logout } from "../../lib/auth";

export default function SignOutButton() {
  return (
    <button onClick={() => logout()}>
      Sign Out
    </button>
  );
}
