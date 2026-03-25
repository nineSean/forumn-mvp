import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && typeof window !== "undefined") {
      window.location.assign(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-gray-900">
        Forum
      </Link>
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </form>
      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <span className="text-sm text-gray-600">{session.user.name}</span>
            {(session.user as any).role === "admin" && (
              <Link href="/admin" className="text-sm text-blue-600 hover:underline">
                Admin
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm text-blue-600 hover:underline"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
