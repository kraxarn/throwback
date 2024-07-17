import {createClient} from "@supabase/supabase-js";
import config from "@/supabase/public.json"

export const supabase = createClient(config.url, config.anonKey)