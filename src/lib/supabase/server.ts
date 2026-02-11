import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client for use in Server Components and Server Actions.
 * Reads and writes cookies via Next.js `cookies()` API to maintain the session.
 */
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method is called from a Server Component where
                        // cookies cannot be set. This is expected when refreshing sessions
                        // during SSR. The middleware will handle the refresh instead.
                    }
                },
            },
        }
    );
}
