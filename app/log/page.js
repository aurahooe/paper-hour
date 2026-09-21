"use client";
import { useEffect, useState } from "react";
import Chrome from "@/components/Chrome";
import { supabase } from "@/lib/supabase";
import { copyForHour } from "@/lib/hours";

export default function Log() {
  const [rows, setRows] = useState([]);
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    (async () => {
      const [{ data: hours }, { data: feats }] = await Promise.all([
        supabase.from("hourly_log").select("*").order("created_at", { ascending: false }).limit(48),
        supabase.from("feature_log").select("*").order("shipped_at", { ascending: false }).limit(24),
      ]);
      setRows(hours || []);
      setFeatures(feats || []);
    })();
  }, []);
  const [h, e] = copyForHour();
  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">The book of hours</div>
          <h2 className="lede">{h}</h2>
          <p className="sub">{e}</p>
        </div>
      </section>
      <section className="grid">
        <article className="card span-7">
          <div className="meta">Turns</div>
          {(rows.length ? rows : [{ title: h, body: e, created_at: new Date().toISOString() }]).map((r, i) => (
            <div className="piece" key={r.id || i}>
              <strong>{r.title || r.headline || "Hour"}</strong>
              <p>{r.body || r.editorial}</p>
              <div className="meta">{new Date(r.created_at || Date.now()).toLocaleString()}</div>
            </div>
          ))}
        </article>
        <aside className="card span-5">
          <div className="meta">Features in the room</div>
          {features.map((f) => (
            <div className="piece" key={f.id}><strong>{f.title}</strong><p>{f.body}</p></div>
          ))}
        </aside>
      </section>
    </Chrome>
  );
}
