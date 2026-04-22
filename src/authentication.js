// Sign the User into the website

import { supabase } from './supabaseConnection';

export const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return { data };
};