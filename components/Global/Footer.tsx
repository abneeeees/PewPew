import Link from "next/link";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "API", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">pewpew</span>
          <span className="text-sm text-muted">&copy; {new Date().getFullYear()}</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
