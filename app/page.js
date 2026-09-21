"use client";

import { useEffect, useState } from "react";
import Chrome from "@/components/Chrome";
import Clock from "@/components/Clock";
import { supabase } from "@/lib/supabase";
import { copyForHour, nextHour } from "@/lib/hours";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [log, setLog] = useState([]);
  const [features, setFeatures] = useState([]);
  const [left, setLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const ms = nextHour() - Date.now();
      const m = Math.max(0, Math.floor(ms / 60000));
      const s = Math.max(0, Math.floor((ms % 60000) / 1000));
      setLeft(`${m}m ${String(s).padStart(2, "0")}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      const [{ data: publicPosts }, { data: hours }, { data: feats }] = await Promise.all([
        supabase.from("posts").select("id,title,body,created_at,user_id").eq("is_public", true).order("created_at", { ascending: false }).limit(6),
        supabase.from("hourly_log").select("*").order("created_at", { ascending: false }).limit(4),
        supabase.from("feature_log").select("*").order("shipped_at", { ascending: false }).limit(4),
      ]);
      setPosts(publicPosts || []);
      setLog(hours || []);
      setFeatures(feats || []);
    })();
  }, []);

  const [headline, editorial] = copyForHour();

  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">Vol. I · this hour</div>
          <h2 className="lede">{headline}</h2>
          <p className="sub">{editorial}</p>
          <p className="meta" style={{ marginTop: 18 }}>Next turn in {left}</p>
        </div>
        <Clock />
      </section>
      <section className="grid">
        <article className="card span-7">
          <div className="meta">On the stoop</div>
          <h2>Public notes</h2>
          {posts.length === 0 && <p className="sub">The stoop is quiet. Sign in and leave something with the light on.</p>}
          {posts.map((p) => (
            <div className="piece" key={p.id}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <div className="meta">{new Date(p.created_at).toLocaleString()}</div>
            </div>
          ))}
        </article>
        <aside className="card span-5">
          <div className="meta">What changed</div>
          <h2>Hour log</h2>
          {(log.length ? log : [{ title: headline, body: editorial, created_at: new Date().toISOString() }]).map((row, i) => (
            <div className="piece" key={row.id || i}>
              <strong>{row.title || row.headline || "Turn"}</strong>
              <p>{row.body || row.editorial}</p>
            </div>
          ))}
        </aside>
        <article className="card span-12">
          <div className="meta">Shipped into the room</div>
          <h2>Features</h2>
          <div className="row" style={{ alignItems: "stretch" }}>
            {(features.length ? features : [{ title: "The room keeps a clock", body: "Every hour the masthead changes." }]).map((f, i) => (
              <div key={f.id || i} style={{ flex: 1, minWidth: 200 }}>
                <h3>{f.title}</h3>
                <p className="sub">{f.body}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </Chrome>
  );
}
