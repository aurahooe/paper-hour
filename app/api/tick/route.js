import { createClient } from "@supabase/supabase-js";
import { copyForHour } from "@/lib/hours";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);
  const [headline, editorial] = copyForHour();
  const { data: featured } = await supabase.from("posts").select("id,title").eq("is_public", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const title = featured ? `Hour featuring ${featured.title}` : headline;
  const body = featured ? `${editorial} On the stoop this hour: ${featured.title}.` : editorial;
  await supabase.from("hourly_log").insert({ title, body });
  return Response.json({ ok: true, title, body });
}
