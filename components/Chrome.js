"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Chrome({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <div className="mark">Est. this hour</div>
          <h1 className="wordmark">Paper Hour</h1>
        </div>
        <nav className="nav">
          <Link href="/">Front</Link>
          <Link href="/stoop">Stoop</Link>
          <Link href="/log">Hour log</Link>
          {user ? <Link href="/desk">Desk</Link> : <Link href="/login">Sign in</Link>}
        </nav>
      </header>
      {children}
    </div>
  );
}
