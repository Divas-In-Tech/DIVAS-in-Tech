// Supabase signs up the user and stores their information

import { supabase } from './supabaseConnection';

export const registerUser = async (email, password, firstName, lastName, eventAttended, isUnder13, parentEmail) => {

    // Register the User's login information
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        // This is stashed in order to add to the users table in the database
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                event_attended: eventAttended,
                is_under_13: isUnder13 === "true",
                parent_email: parentEmail
            }
        }
    });

    if (signUpError) throw signUpError;

    return signUpData;
};
