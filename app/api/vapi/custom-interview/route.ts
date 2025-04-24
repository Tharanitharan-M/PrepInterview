import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const {
    jobTitle,
    companyName,
    jobDescription,
    numberOfQuestions,
    difficultyLevel,
    resumeContent,
    userId,
  } = await request.json();

  try {
    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are an expert technical interviewer with deep experience in assessing candidates for roles in technology companies. Your task is to create tailored interview questions based on the candidate's resume and the job description provided.

Resume:
${resumeContent}

Job Description for the ${jobTitle} position at ${companyName}:
${jobDescription}

Step 1: Analyze the alignment between the candidate and the job by:
- Extracting key technical and soft skills from both the resume and the job description
- Evaluating the candidate's experience level relative to the role
- Highlighting major responsibilities outlined in the job description
- Identifying any technical or experience gaps
- Considering potential cultural fit based on the company's known values and role expectations

Step 2: Generate exactly ${numberOfQuestions} interview questions that:
- Reflect a ${difficultyLevel} difficulty level
- Include a balance of technical and behavioral questions
- Target areas where there are skill gaps or high-value responsibilities
- Assess both required competencies and alignment with company culture
- Are directly relevant to the ${jobTitle} position at ${companyName}

CRITICAL: You must return ONLY a valid JSON array of strings containing the questions. No other text, no code blocks, no backticks. The response should start with [ and end with ]. Example:
["Tell me about your experience with...", "How would you handle...", "What approach would you take..."]

Voice assistant guidelines:
- Keep language natural and conversational
- Avoid using symbols or punctuation like slashes (/) or asterisks (*)
- Ensure each question is clearly phrased for spoken delivery`,
    });

    // Clean up the response and ensure it's valid JSON
    let questions;
    try {
      // Remove any potential markdown code block formatting
      const cleanedResponse = rawQuestions.replace(/\`\`\`json|\`\`\`|\`/g, '').trim();
      questions = JSON.parse(cleanedResponse);

      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      if (questions.length !== numberOfQuestions) {
        throw new Error(`Expected ${numberOfQuestions} questions but got ${questions.length}`);
      }
    } catch (parseError) {
      console.error('Failed to parse questions:', parseError);
      throw new Error('Failed to generate valid interview questions');
    }

    // Create the interview document
    const interview = {
      role: jobTitle,
      company: companyName,
      type: "Custom Interview",
      level: difficultyLevel,
      questions,
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      techstack: [],
    };

    const interviewRef = await db.collection("interviews").add(interview);

    return Response.json(
      {
        success: true,
        interviewId: interviewRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }, 
      { status: 500 }
    );
  }
}
