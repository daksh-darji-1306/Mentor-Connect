
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env file.')
    // Fallback to a dummy client or null to prevent crash, but operations will fail.
    // Better to throw a clear error when used, but for now prevent top-level crash.
    supabase = {
        from: () => ({ select: () => ({ data: null, error: { message: "Supabase not configured" } }) }),
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        }
    };
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

