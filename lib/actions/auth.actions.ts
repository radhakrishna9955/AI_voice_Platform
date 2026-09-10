'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }
        await db.collection('users').doc(uid).set({
            name,
            email,
            createdAt: new Date().toISOString()
        });

        return {
            success: true,
            message: 'User created successfully'
        }

    } catch (error: any) {
        console.log('Error in signUp action:', error);
        if (error.code === 'auth/email-already-in-use') {
            return {
                success: false,
                message: 'Email is already in use'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'No user found with this email'
            }
        }
        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Signed in successfully'
        }

    } catch (error: any) {
        console.log('Error in signIn action:', error);
        return {
            success: false,
            message: error?.message || 'Failed to log into account'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: ONE_WEEK * 1000 }); // 7 days

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

// Get current user from session cookie so will get to know who is logged in
export async function getCurrentUser(): Promise<User | null> {
    const cookiesStore = await cookies();

    const sessionCookie = cookiesStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) return null;
        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;

    } catch (error) {
        console.log('Error in getCurrentUser action:', error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

export async function signOut() {
    const cookiesStore = await cookies();
    cookiesStore.delete('session');
}