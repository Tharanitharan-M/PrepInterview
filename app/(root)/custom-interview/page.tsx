import React from 'react';
import { getCurrentUser } from "@/lib/actions/auth.actions";
import CustomInterviewForm from '@/components/CustomInterviewForm';
import Image from "next/image";

export default async function CustomInterviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Image
          src="/robot.png"
          alt="AI Interview Assistant"
          width={200}
          height={200}
          className="mb-6 max-sm:hidden"
        />
        <h1 className="text-3xl font-bold mb-4">Create Your Custom Interview</h1>
        <p className="text-muted-foreground max-w-2xl">
          Upload your resume and paste a job description to generate tailored interview questions that help you prepare for your target role.
        </p>
      </div>

      <CustomInterviewForm userId={user.id} />
    </div>
  );
} 