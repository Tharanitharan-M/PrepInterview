import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from '@/lib/actions/auth.actions';

const Page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewByUserId(user?.id!),
    getLatestInterviews({userId: user?.id!}),
  ]);
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-primary-100">
            Get Interview Ready with AI-powered mock interviews
          </h2>
          <p className="text-lg">
            Practice with real interview questions and get feedback on your performance.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>


        <Image src="/robot.png" alt="robot person" width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>
          Your Interviews
        </h2>
        <div className="interviews-section">
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>No interviews yet</p>
            )
          }
        </div>
      </section>


      <section className="flex flex-col gap-6 mt-8">
        <h2> 
          Take an Interview
        </h2>
        <div className="interviews-section">
        {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>There are no interviews available at the moment</p>
            )
          }
          {/* /* There are no interviews available at the moment</p> */} 
        </div>
      </section>
    </>
  );
}
export default Page;