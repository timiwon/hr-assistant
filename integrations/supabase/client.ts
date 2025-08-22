import { createClient as createDBClient, SupabaseClient } from "@supabase/supabase-js";

interface Session {
    getToken: () => void;
};
export function createClient(session: Session): SupabaseClient {
    return createDBClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            accessToken: async () => session?.getToken() ?? null,
        }
    );
}