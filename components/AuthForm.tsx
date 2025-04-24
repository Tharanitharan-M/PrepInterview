"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import {auth, googleProvider} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.actions";
import { GoogleAuthProvider } from "firebase/auth";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .max(100, "Password must not exceed 100 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the Firebase ID token instead of the access token
      const idToken = await user.getIdToken();

      if (!idToken) {
        toast.error('Google sign in failed');
        return;
      }

      // Sign in with the backend
      const signInResult = await signIn({
        email: user.email!,
        idToken,
        photoURL: user.photoURL || undefined,
        displayName: user.displayName || undefined
      });

      if (!signInResult?.success) {
        toast.error(signInResult?.message || 'Sign in failed');
        return;
      }

      toast.success('Signed in with Google successfully.');
      router.push('/');
      router.refresh(); // Force a refresh of the page data
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in with Google');
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if(type === 'sign-up') {
            const { name, email, password } = values;

            try {
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                });

                if(!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success('Account created successfully. Please sign in.');
                router.push('/sign-in')
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    toast.error('This email is already registered. Please sign in instead.');
                    router.push('/sign-in');
                    return;
                }
                throw error; // Re-throw other errors to be caught by the outer catch
            }
        } else {
            const { email, password } = values;

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const idToken = await userCredential.user.getIdToken();

            if(!idToken) {
                toast.error('Sign in failed')
                return;
            }

            const result = await signIn({
                email, 
                idToken
            });

            if (!result?.success) {
                toast.error(result?.message);
                return;
            }

            toast.success('Sign in successfully.');
            // Add a small delay before redirecting to ensure the session is properly set
            setTimeout(() => {
                router.push('/');
                router.refresh(); // Force a refresh of the page data
            }, 500);
        }
    } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/invalid-credential') {
            toast.error('Invalid email or password');
        } else if (error.code === 'auth/too-many-requests') {
            toast.error('Too many failed attempts. Please try again later');
        } else {
            toast.error('An error occurred. Please try again');
        }
    }
}

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="-2xl font-boltextd">PrepWise</h2>
        </div>
        <h3>Practice job interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
                type="text"
                formType={type}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
              formType={type}
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              formType={type}
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <Image
            src="/google.svg"
            alt="Google logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign in with Google
        </Button>

        <p className="text-center">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
