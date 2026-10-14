import Link from "next/link";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-cream">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-stone-200 bg-white p-4 sm:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <img src="/logo.png" alt="Magnetiq" className="h-10 w-10" />
          <span className="text-sm font-semibold text-stone-500">Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-brand/10 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-600">
            Log out
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Magnetiq" className="h-9 w-9" />
            <span className="text-sm font-semibold text-stone-500">Admin</span>
          </div>
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-stone-500">Log out</button>
          </form>
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
