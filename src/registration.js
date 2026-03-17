// Supabase signs up the user and stores their information

import { supabase } from './supabaseConnection';

export const registerUser = async (email, password, firstName, lastName) => {

    // Register the User's login information
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) throw signUpError;
    
    // Store the User's information
    const { error: databaseError } = await supabase.from('users').insert([{
        first_name: firstName,
        last_name: lastName,
        email: email,
    }])

    if (databaseError) throw databaseError;

    return signUpData;
};
