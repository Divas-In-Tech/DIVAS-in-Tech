import { supabase } from './supabaseConnection';

export const sendResetPasswordEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password',
    });

    if (error) {
        throw error;
    }

    return { data };
}

export const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        throw error;
    }

    return { data };
}