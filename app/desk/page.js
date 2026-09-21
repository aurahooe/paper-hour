"use client";
import { useEffect, useState } from "react";
import Chrome from "@/components/Chrome";
import { supabase } from "@/lib/supabase";

export default function Desk() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ handle: "", display_name: "" });
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      const [{ data: p }, { data: mine }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle(),
        supabase.from("posts").select("*").eq("user_id", data.user.id).order("created_at", { ascending: false }),
      ]);
      if (p) setProfile(p);
      setNotes(mine || []);
    })();
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    const { error } = await supabase.from("profiles").upsert({ id: user.id, handle: profile.handle.slice(0, 32), display_name: profile.display_name.slice(0, 80) });
    setMsg(error ? error.message : "Name kept.");
  }

  async function publish(e) {
    e.preventDefault();
    const { data, error } = await supabase.from("posts").insert({ user_id: user.id, title, body, is_public: isPublic }).select().single();
    if (error) { setMsg(error.message); return; }
    setNotes((n) => [data, ...n]);
    setTitle(""); setBody("");
    setMsg(isPublic ? "On the stoop." : "In the drawer.");
  }

  async function toggle(note) {
    const { data, error } = await supabase.from("posts").update({ is_public: !note.is_public }).eq("id", note.id).select().single();
    if (error) return setMsg(error.message);
    setNotes((rows) => rows.map((r) => (r.id === note.id ? data : r)));
  }

  async function remove(id) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return setMsg(error.message);
    setNotes((rows) => rows.filter((r) => r.id !== id));
  }

  async function leave() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!user) return null;

  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">Your desk</div>
          <h2 className="lede">Write it once. Decide who sees it.</h2>
        </div>
        <button className="btn ghost" onClick={leave}>Lock the door</button>
      </section>
      <section className="grid">
        <form className="card span-7" onSubmit={publish}>
          <div className="meta">New note</div>
          <input className="field" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="field" placeholder="Leave it on the table." value={body} onChange={(e) => setBody(e.target.value)} required />
          <label className="row">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Mark public — shows on the stoop
          </label>
          <div style={{ height: 12 }} />
          <button className="btn" type="submit">Keep this</button>
        </form>
        <form className="card span-5" onSubmit={saveProfile}>
          <div className="meta">Masthead name</div>
          <input className="field" placeholder="handle" value={profile.handle || ""} onChange={(e) => setProfile({ ...profile, handle: e.target.value })} />
          <input className="field" placeholder="display name" value={profile.display_name || ""} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} />
          <button className="btn ghost" type="submit">Save name</button>
        </form>
        <article className="card span-12">
          <div className="meta">Drawer</div>
          <h2>Your notes</h2>
          {notes.map((n) => (
            <div className="piece" key={n.id}>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <div className="row">
                <span className="meta">{n.is_public ? "Public" : "Private"} · {new Date(n.created_at).toLocaleString()}</span>
                <button className="btn ghost" type="button" onClick={() => toggle(n)}>{n.is_public ? "Pull inside" : "Put on stoop"}</button>
                <button className="btn ghost" type="button" onClick={() => remove(n.id)}>Burn</button>
              </div>
            </div>
          ))}
        </article>
      </section>
      {msg && <div className="toast">{msg}</div>}
    </Chrome>
  );
}
