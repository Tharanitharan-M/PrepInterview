"use client";

import { signOut } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

  return (
    <button onClick={handleSignOut} className="btn-primary">
      Sign Out
    </button>
  );
};

export default SignOutButton;
