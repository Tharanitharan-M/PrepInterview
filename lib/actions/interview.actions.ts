"use server";

import { storage } from "@/firebase/admin";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "./auth.actions";

export async function uploadResume(file: File): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const fileBuffer = await file.arrayBuffer();
  const fileName = `resumes/${user.id}/${Date.now()}_${file.name}`;
  
  await storage.bucket().file(fileName).save(Buffer.from(fileBuffer));
  
  return fileName;
}

export async function generateCustomInterview(params: {
  resumeUrl: string;
  jobDescription: string;
  numberOfQuestions: number;
  difficultyLevel: string;
}): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { resumeUrl, jobDescription, numberOfQuestions, difficultyLevel } = params;

  // Create a new interview document
  const interviewRef = await db.collection("interviews").add({
    userId: user.id,
    resumeUrl,
    jobDescription,
    numberOfQuestions,
    difficultyLevel,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // TODO: Implement resume parsing and question generation
  // 1. Parse resume using pdf-parse
  // 2. Extract skills and experience
  // 3. Analyze job description
  // 4. Generate relevant questions using AI
  // 5. Update interview document with questions

  return interviewRef.id;
} 