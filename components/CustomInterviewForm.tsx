"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCurrentUser } from "@/lib/actions/auth.actions";

const formSchema = z.object({
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  numberOfQuestions: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 5 && num <= 20;
  }, 'Please select between 5 and 20 questions'),
  difficultyLevel: z.string(),
});

interface Props {
  userId: string;
}

const CustomInterviewForm = ({ userId }: Props) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      numberOfQuestions: '5',
      difficultyLevel: 'beginner',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setResumeFile(file);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        resolve(text as string);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    try {
      setIsUploading(true);
      
      // Read the resume content
      const resumeContent = await readFileContent(resumeFile);

      // Send to API
      const response = await fetch('/api/vapi/custom-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: values.jobTitle,
          companyName: values.companyName,
          jobDescription: values.jobDescription,
          numberOfQuestions: parseInt(values.numberOfQuestions),
          difficultyLevel: values.difficultyLevel,
          resumeContent,
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Interview questions generated successfully!');
        router.push(`/interview/${data.interviewId}`);
      } else {
        throw new Error('Failed to generate interview');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate interview questions');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <FormItem>
                <FormLabel>Upload Resume (PDF)</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {resumeFile && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Selected: {resumeFile.name}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your resume in PDF format to generate relevant interview questions
                </FormDescription>
              </FormItem>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="numberOfQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select number of questions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[5, 10, 15, 20].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} questions
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the job description here..."
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Paste the job description to tailor questions to the position
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button 
              type="submit" 
              disabled={isUploading}
              className="btn-primary w-full md:w-auto"
            >
              {isUploading ? 'Generating Questions...' : 'Generate Interview'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default CustomInterviewForm; 