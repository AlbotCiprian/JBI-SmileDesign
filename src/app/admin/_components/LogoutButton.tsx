"use client";

import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await signOut({ callbackUrl: "/admin/login" });
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-xs font-semibold text-jbi-navy transition-colors hover:bg-jbi-soft disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Se deconectează...
        </>
      ) : (
        <>
          <LogOut className="h-3.5 w-3.5" /> Deconectare
        </>
      )}
    </button>
  );
}
