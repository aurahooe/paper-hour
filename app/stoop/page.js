"use client";
import { useEffect, useState } from "react";
import Chrome from "@/components/Chrome";
import { supabase } from "@/lib/supabase";

export default function Stoop() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("posts").select("id,title,body,created_at,user_id,profiles(display_name,handle)").eq("is_public", true).order("created_at", { ascending: false }).limit(40);
      setPosts(data || []);
    })();
  }, []);
  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">The stoop</div>
          <h2 className="lede">Whatever people marked public lives here.</h2>
          <p className="sub">No ranking. Newest first. If it is on this page, someone chose daylight.</p>
        </div>
      </section>
      <section className="grid">
        {posts.map((p, i) => (
          <article className={`card ${i % 3 === 0 ? "span-7" : "span-5"}`} key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
            <div className="meta">{p.profiles?.display_name || p.profiles?.handle || "A reader"}</div>
            <h2>{p.title}</h2>
            <p>{p.body}</p>
            <div className="meta">{new Date(p.created_at).toLocaleString()}</div>
          </article>
        ))}
        {posts.length === 0 && (<article className="card span-12"><p className="sub">Empty stoop. Be the first to leave a chair out.</p></article>)}
      </section>
    </Chrome>
  );
}
