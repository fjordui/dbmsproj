import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabaseSchemaEnv = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA_ENV || "public";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
}

export const browserClient = createClient(supabaseUrl, supabaseKey, {
  db: { schema: supabaseSchemaEnv },
});
