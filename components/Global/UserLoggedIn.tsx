import { auth } from "@/app/auth";
import Image from "next/image";
import SignOutButton from "../../components/Auth/SignOut";
import Link from "next/link";

export default async function UserLoggedIn() {
  const session = await auth();

  if (session)
    return (
      <div className="group relative">
        <button className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-3 transition-colors hover:border-border hover:bg-surface-raised">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              width={32}
              height={32}
              alt={session.user.name ?? "User avatar"}
              className="rounded-full border border-border"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-medium text-accent">
              {session.user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <span className="hidden text-sm font-medium text-foreground sm:inline">
            {session.user?.name}
          </span>
        </button>

        {/* pt-2 is the hover bridge — it's part of this element, not a gap, so hover survives the descent */}
        <div className="invisible absolute right-0 top-full z-50 w-64 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
          <div className="rounded-xl border border-border bg-surface-raised p-4 shadow-2xl shadow-black/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  width={40}
                  height={40}
                  alt={session.user.name ?? "User avatar"}
                  className="rounded-full border border-border"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-medium text-accent">
                  {session.user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {session.user?.name}
                </p>
                <p className="truncate text-xs text-muted">
                  {session.user?.email}
                </p>
              </div>
            </div>

            <div className="my-3 h-px bg-border" />

            <SignOutButton />
          </div>
        </div>
      </div>
    );

  return (
    <Link
      href="/login"
      className="rounded-lg border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-accent/40 hover:text-accent"
    >
      Login
    </Link>
  );
}