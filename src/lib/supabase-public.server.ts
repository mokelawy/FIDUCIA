import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Fallback values so the site works on external hosts (e.g. Cloudflare Pages)
// even when SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY env vars are not configured.
// These are public (publishable) values, safe to embed in server code.
const FALLBACK_SUPABASE_URL = "https://kfwbrlkwofalzwzeagne.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_oqUxKjFH7qqEtsfcSqQt6g_7LD8dAKM";

export function createPublicSupabase() {
  const url =
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"] ||
    FALLBACK_SUPABASE_URL;
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    FALLBACK_SUPABASE_PUBLISHABLE_KEY;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
