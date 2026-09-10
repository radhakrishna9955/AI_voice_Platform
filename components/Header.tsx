"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Home, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth.actions";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  // Don't show header on auth pages
  if (pathname?.includes("/sign-in") || pathname?.includes("/sign-up")) {
    return null;
  }

  return (
    <header>
      <div className="container flex h-16 items-center justify-between px-4">
        <nav className="flex items-center gap-6">
            <Link
            href="/profile"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${
              pathname === "/profile" ? "text-white" : "text-gray-400"
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
