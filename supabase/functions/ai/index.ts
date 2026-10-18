// Salut i seny · Edge Function "ai"
// Fa d'intermediària entre l'app i l'API de Claude (Anthropic) perquè la clau
// de l'API no quedi mai visible al codi de la pàgina. Només accepta usuaris
// que hagin iniciat sessió a l'app.
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    // 1) Comprova que qui crida és un usuari amb sessió iniciada
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return json({ error: "Cal iniciar sessió" }, 401);

    // 2) Prepara la petició a Claude (text + fotos opcionals)
    const { prompt, images = [], model } = await req.json();
    if (!prompt || String(prompt).length > 8000) return json({ error: "Petició no vàlida" }, 400);
    const content = [
      ...images.slice(0, 2).map((i: { media_type: string; data: string }) => ({
        type: "image", source: { type: "base64", media_type: i.media_type, data: i.data },
      })),
      { type: "text", text: `${prompt}\n\nRespon NOMÉS amb un objecte JSON vàlid, sense text addicional ni blocs de codi.` },
    ];
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: model === "quick"
          ? (Deno.env.get("ANTHROPIC_MODEL_QUICK") ?? "claude-haiku-5-5")
          : (Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5-5"),
        max_tokens: 2000,
        messages: [{ role: "user", content }],
      }),
    });
    const d = await r.json();
    if (!r.ok) return json({ error: d?.error?.message ?? "Error de l'API" }, 502);

    // 3) Retorna el JSON que ha generat Claude
    const text = (d.content ?? []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("");
    let parsed = null;
    try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
    catch { const m = text.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); }
    return json({ json: parsed });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
