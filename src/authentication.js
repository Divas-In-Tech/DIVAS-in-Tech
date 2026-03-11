// Sign the User into the website

import { supabase } from './supabaseClient';

export const signInUser = async (email, password) => {

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        return signInError;
    } else {
        return signInData;
    }
};