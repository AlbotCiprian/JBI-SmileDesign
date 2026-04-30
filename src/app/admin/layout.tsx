import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Calendar, Home, Users } from "lucide-react";
import { LogoutButton } from "./_components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Layout-ul se aplică și pentru /admin/login. Permite-l fără sesiune.
  // Detectăm dacă e login page prin lipsa user-ului — atunci returnăm direct children.
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-jbi-gray">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-jbi-navy/5 bg-white lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center gap-3 border-b border-jbi-navy/5 px-5 lg:h-20">
            <Image
              src="/images/jbi-logo.png"
              alt="JBI"
              width={36}
              height={36}
              className="rounded-md"
            />
            <div>
              <p className="font-display text-sm font-semibold text-jbi-navy">
                JBI Smile Design
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-jbi-navy/50">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="flex gap-1 px-3 py-3 lg:flex-col lg:py-5">
            <NavLink href="/admin" Icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink href="/admin#programari" Icon={Calendar}>Programări</NavLink>
            <NavLink href="/admin/clienti" Icon={Users}>Clienți</NavLink>
            <NavLink href="/" Icon={Home}>Vezi site-ul</NavLink>
          </nav>

          <div className="hidden border-t border-jbi-navy/5 px-5 py-4 lg:block">
            <p className="text-xs text-jbi-navy/50">Conectat ca</p>
            <p className="truncate text-sm font-semibold text-jbi-navy">
              {session.user.email ?? session.user.name}
            </p>
            <div className="mt-3">
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  Icon,
  children,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-jbi-navy/80 transition-colors hover:bg-jbi-soft hover:text-jbi-navy"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
