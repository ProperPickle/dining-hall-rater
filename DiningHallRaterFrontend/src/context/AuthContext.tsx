import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../Client.ts';

interface AuthContextType {
    session: any;
    signUpUser: (username: string, email: string, password: string) => Promise<AuthResult>;
    signInUser: (email: string, password: string) => Promise<AuthResult>;
}

interface CustomErrorType {
    name: string,
    message: string,
    status: number
}

type AuthResult = 
    | { success: true; data: any }
    | { success: false; error: any };

const AuthContext = createContext<AuthContextType | null>(null);

function createCustomError(name: string, message: string, status: number): CustomErrorType {
    return {
        name,
        message,
        status
    };
}

function logErrorMessage(outputError: any): void {
    console.error('Encountered an error while signing up:', outputError);
}

const usernameExists = async(username: string):Promise<boolean> => {
    const {data: existingName, error: otherError} = await supabase
        .from('accounts')
        .select('name')
        .eq('name', username.trim())
        .maybeSingle();
    console.log('Username to check:', username);
    console.log('Username returned:', existingName);
    console.log('DB error returned', otherError);
    return existingName !== null;
};

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
        // Checks if any of the fields are empty. Trim removes spaces, preventing space-only entries.
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            // Custom error to return when a user tries to sign up with an existing email. By default, even though Supabase Auth doesn't re-register an existing account, it returns success. 
            const validationError = createCustomError(
                'ValidationError',
                'One of the sign up fields is missing (username, email, password).',
                422
            );
            logErrorMessage(validationError);
            return {success: false, error: validationError};
        }

        if (await usernameExists(username)) {
            // Custom error to return when a user tries to sign up with an existing username. By default, even though Supabase Auth doesn't re-register an existing account, it returns success. 
            const duplicateUsernameError = createCustomError(
               'ValidationError',
                'An account with that username already exists.',
                422
            );
            logErrorMessage(duplicateUsernameError);
            
            return {success: false, error: duplicateUsernameError};
        } 

        // The auth users table has a trigger that will automatically assign the corresponding user id and username to a new row in the public accounts table
        const {data, error} = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: password,
            options: {
                data: {
                    name: username.trim()
                }
            }
        });

        // If a sign up uses an email that already exists, data.user.identities.length will be an empty array
        if (data?.user?.identities?.length === 0) {
            const duplicateEmailError = createCustomError(
               'ValidationError',
                'An account with that email already exists.',
                422
            );
            logErrorMessage(duplicateEmailError);
            return { 
                success: false, 
                error: duplicateEmailError
            };
        }

        // Returns an error if a user's sign up was successful, but still needs to confirm their email.
        console.log('user:',data.user);
        console.log('session:',data.session);
        if (data.user && !data.session) {
            const unconfirmedEmailError = createCustomError(
                'ValidationError',
                'Verify your account by accessing the confirmation email sent to the email address.',
                422
            );
            logErrorMessage(unconfirmedEmailError);
            return {success: false, error: unconfirmedEmailError};
        }

        if (error) {
            logErrorMessage(error);
            return {success: false, error};
        }

        return {success: true, data};
    };

    const signInUser = async (email: string, password: string): Promise<AuthResult> => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password
        });

        if (error) {
            logErrorMessage(error);
            return {success: false, error};
        }

        return {success: true, data};
    };

    return (
        <AuthContext.Provider
            value={{session, signUpUser, signInUser}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = (): AuthContextType | null => {
    return useContext(AuthContext);
};