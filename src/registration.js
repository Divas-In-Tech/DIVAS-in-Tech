// Supabase signs up the user and stores their information

import { supabase } from './supabaseClient';

export const registerUser = async (emailAddress, password, firstName, lastName, eventAttended) => {

    // Register the User's login information
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) throw signUpError;
    
    // Store the User's information
    const { error: databaseError } = await supabase.from('Users').insert([{
        first_name: firstName,
        last_name: lastName,
        email: emailAddress,
        event: eventAttended,
    }])

    if (databaseError) throw databaseError;

    return signUpData;
};
