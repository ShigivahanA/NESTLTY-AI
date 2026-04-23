import { supabase } from '../utils/supabaseClient'
export { supabase }

// AUTH HELPERS
export const auth = {
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    getUser: () => supabase.auth.getUser(),
    onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
}

// CHILD PROFILES
export async function getChildProfiles() {
    const { data: { user } } = await auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getChildById(id) {
    const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', id)
        .single()
    if (error) throw error
    return data
}

// STORIES
export async function getStoriesByChild(childId) {
    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getStoryById(id) {
    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// STORY GENERATION FLOW
export async function createDailyInput(payload) {
    const { data, error } = await supabase
        .from('daily_inputs')
        .insert([payload])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function createStorySession(payload) {
    const { data: { user } } = await auth.getUser()
    const { data, error } = await supabase
        .from('story_sessions')
        .insert([{ ...payload, user_id: user.id, status: 'pending' }])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateStorySession(id, payload) {
    const { data, error } = await supabase
        .from('story_sessions')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function createStory(payload) {
    const { data: { user } } = await auth.getUser()
    const { data, error } = await supabase
        .from('stories')
        .insert([{ ...payload, user_id: user.id }])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function toggleLikeStory(id, isLiked) {
    const { data, error } = await supabase
        .from('stories')
        .update({ is_favorite: isLiked })
        .eq('id', id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteStory(id) {
    const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)
    if (error) throw error
    return true
}

// SUBSCRIPTIONS
export async function getSubscription() {
    const { data: { user } } = await auth.getUser()
    if (!user) return null

    // Attempt to fetch existing subscription
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle() // Use maybeSingle to avoid 406 errors on empty results

    if (error) throw error

    // If no subscription exists, safely create a default FREE one
    if (!data) {
        const { data: newSub, error: createError } = await supabase
            .from('subscriptions')
            .upsert([{
                user_id: user.id,
                tier: 'free',
                status: 'active',
                stories_generated: 0
            }], { onConflict: 'user_id' }) // Ensure we don't duplicate
            .select()
            .single()

        if (createError) throw createError
        return newSub
    }

    return data
}

export async function updateSubscription(tier) {
    const { data: { user } } = await auth.getUser()
    if (!user) throw new Error("User not found")

    const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
            user_id: user.id,
            tier,
            status: 'active'
        }, { onConflict: 'user_id' })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function incrementUsage() {
    const { data: { user } } = await auth.getUser()
    const { data: current } = await supabase
        .from('subscriptions')
        .select('stories_generated')
        .eq('user_id', user.id)
        .single()

    const { data, error } = await supabase
        .from('subscriptions')
        .update({ stories_generated: (current?.stories_generated || 0) + 1 })
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function incrementTtsUsage() {
    const { data: { user } } = await auth.getUser()
    const { data: current } = await supabase
        .from('subscriptions')
        .select('tts_usage_count')
        .eq('user_id', user.id)
        .single()

    const { data, error } = await supabase
        .from('subscriptions')
        .update({ tts_usage_count: (current?.tts_usage_count || 0) + 1 })
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) throw error
    return data
}

// GENERIC HELPERS (Keeping for flexibility)
export async function getAll(table) {
    const { data, error } = await supabase.from(table).select('*')
    if (error) throw error
    return data
}

export async function createRecord(table, payload) {
    const { data, error } = await supabase
        .from(table)
        .insert([payload])
        .select()
    if (error) throw error
    return data
}

// CONTACT & NEWSLETTER
export async function submitContactForm(payload) {
    const { error } = await supabase
        .from('contact_submissions')
        .insert([payload])

    if (error) throw error
    return true
}

export async function subscribeNewsletter(email) {
    const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }])

    // If it's a duplicate email error (23505), we treat it as success 
    // because the user is already subscribed.
    if (error && error.code !== '23505') throw error
    return true
}
