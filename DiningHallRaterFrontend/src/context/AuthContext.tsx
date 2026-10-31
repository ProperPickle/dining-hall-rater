import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../Client.ts';

interface AuthContextType {
    session: any;
    signUpUser: (username: string, email: string, password: string) => Promise<AuthResult>;
}

type AuthResult = 
    | { success: true; data: any }
    | { success: false; error: any };

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: {session} }) => {
        setSession(session);
        });

        supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        });
    }, []);

    const signUpUser = async(username: string, email: string, password: string): Promise<AuthResult> => {
        // The auth users table has a trigger that will automatically assign the corresponding user id and username to a new row in the public accounts table
        const {data, error} = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: password,
            options: {
                data: {
                    name: username
                }
            }
        });

        if (error) {
            console.error("Encountered an error while signing up:", error);
            return {success: false, error};
        }

        return {success: true, data}
    };

    return (
        <AuthContext.Provider
            value={{session, signUpUser}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = (): AuthContextType | null => {
    return useContext(AuthContext);
};