import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 10

if (!isConfigured) {
    console.warn(
        '⚠️ Supabase credentials not configured. Create a .env file in the project root with:\n' +
        'VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
        'VITE_SUPABASE_ANON_KEY=your-anon-key'
    )
}

// Only create client with real URL, otherwise use a mock-safe instance
export const supabase: SupabaseClient = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://localhost.supabase.co', 'placeholder-key-that-is-long-enough')

export const isSupabaseConfigured = isConfigured

export const createNotification = async (payload: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    link?: string
}) => {
    if (!isSupabaseConfigured) return

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase.from('notifications').insert({
            user_id: user.id,
            ...payload
        })
    } catch (err) {
        console.error('Error creating notification:', err)
    }
}
