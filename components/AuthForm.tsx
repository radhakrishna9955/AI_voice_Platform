"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import FormField from './FormField'
import { useRouter } from 'next/dist/client/components/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { signIn, signUp } from '@/lib/actions/auth.actions'

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8)
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();

    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === 'sign-up') {
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email: email,
                    password: password
                })

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                };
                toast.success("Account created successfully! Please sign in.");
                router.push('/sign-in');
            } else {
                const { email, password } = values;

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredentials.user.getIdToken();

                if (!idToken) {
                    toast.error("Sign in failed");
                    return {
                        success: false,
                        message: 'Sign in failed'
                    }
                }

                await signIn({
                    email, idToken
                })

                toast.success("Signed in successfully!");
                router.push('/');
            }
        } catch (error: any) {
            console.log("Error:", error);

            // Handle specific Firebase auth errors
            const errorCode = error?.code;
            let errorMessage = "Something went wrong. Please try again.";

            switch (errorCode) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already registered. Please sign in instead.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password is too weak. Please use at least 6 characters.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email. Please sign up first.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password. Please check your credentials.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                default:
                    errorMessage = error?.message || "Something went wrong. Please try again.";
            }

            toast.error(errorMessage);
        }
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className='auth-layout card-border lg:min-w-[566px]'>
            <div className='flex flex-col gap-6 card py-14 px-10'>
                <div className='flex flex-row gap-2 justify-center'>
                    <Image src='/logo.svg' alt='logo' height={32} width={38} />
                    <h2 className='text-primary-100'>InterviewIQ</h2>
                </div>
                <h3>Practice job interviews with AI</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Enter Your Name"
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Enter Your Email"
                            type="email" />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter Your Password"
                            type="password"
                        />
                        <Button
                            className='btn'
                            type="submit">{isSignIn ? 'Sign In' : 'Create an Account'}</Button>
                    </form>
                </Form>
                <p className='text-center'>
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}
                    <Link href={!isSignIn ? "/sign-in" : "sign-up"} className='font-bold text-user-primary ml-1'>
                        {!isSignIn ? "Sign in" : "Sign up"}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm