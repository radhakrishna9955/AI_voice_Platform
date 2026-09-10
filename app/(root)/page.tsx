import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import CreateInterviewButton from '@/components/CreateInterviewButton'

const page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 px-4'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-purple-500/10 pointer-events-none'></div>
        <div className='container mx-auto max-w-6xl relative z-10'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <div className='flex-1 text-center lg:text-left'>
              <h1 className='text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
                Ace Your Next
                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-primary-100 to-purple-500'>
                  Job Interview
                </span>
              </h1>
              <p className='text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0'>
                Practice with AI, get instant feedback, and land your dream job. Improve your technical and behavioral skills in just 6 minutes.
              </p>
              <div className='flex gap-4 justify-center lg:justify-start flex-wrap'>
                {user ? (
                  <CreateInterviewButton />
                ) : (
                  <>
                    <Button asChild className='btn-primary text-lg px-8 py-6'>
                      <Link href="/sign-in">
                        Start Free Practice
                      </Link>
                    </Button>
                    <Button asChild className='btn-secondary text-lg px-8 py-6'>
                      <Link href="/sign-up">
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className='flex-1 relative'>
              <div className='relative w-full max-w-md mx-auto'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary-100 to-purple-500 rounded-3xl blur-3xl opacity-20'></div>
                <Image 
                  src="/robot.png" 
                  alt="AI Interview Assistant" 
                  width={500} 
                  height={500} 
                  className='relative z-10 drop-shadow-2xl'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>Why Choose InterviewIQ?</h2>
            <p className='text-gray-400 text-lg'>Everything you need to ace your interviews</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='group bg-dark-300 border border-dark-400 rounded-2xl p-8 hover:border-primary-100 transition-all hover:scale-105'>
              <div className='w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-500 rounded-xl flex items-center justify-center mb-6'>
                <Image src="/star.svg" alt="AI Powered" width={28} height={28} />
              </div>
              <h3 className='text-xl font-bold mb-3 text-white'>AI-Powered Interviews</h3>
              <p className='text-gray-400 leading-relaxed'>
                Practice with an intelligent AI that adapts to your responses and asks relevant follow-up questions.
              </p>
            </div>

            <div className='group bg-dark-300 border border-dark-400 rounded-2xl p-8 hover:border-primary-100 transition-all hover:scale-105'>
              <div className='w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-500 rounded-xl flex items-center justify-center mb-6'>
                <Image src="/calendar.svg" alt="Instant Feedback" width={28} height={28} />
              </div>
              <h3 className='text-xl font-bold mb-3 text-white'>Instant Feedback</h3>
              <p className='text-gray-400 leading-relaxed'>
                Receive detailed scores on technical and behavioral aspects with actionable improvement suggestions.
              </p>
            </div>

            <div className='group bg-dark-300 border border-dark-400 rounded-2xl p-8 hover:border-primary-100 transition-all hover:scale-105'>
              <div className='w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-500 rounded-xl flex items-center justify-center mb-6'>
                <Image src="/tech.svg" alt="Any Tech Stack" width={28} height={28} />
              </div>
              <h3 className='text-xl font-bold mb-3 text-white'>Any Tech Stack</h3>
              <p className='text-gray-400 leading-relaxed'>
                Practice for roles across any technology - React, Python, Java, or custom requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='mt-20'>
        <h2 className='text-center mb-12'>How It Works</h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='text-center'>
            <div className='w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold text-xl'>
              1
            </div>
            <h4 className='font-semibold mb-2'>Choose Your Role</h4>
            <p className='text-sm text-light-100'>Select the position and tech stack you&apos;re preparing for</p>
          </div>
          
          <div className='text-center'>
            <div className='w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold text-xl'>
              2
            </div>
            <h4 className='font-semibold mb-2'>Set Preferences</h4>
            <p className='text-sm text-light-100'>Choose between technical, behavioral, or mixed interview types</p>
          </div>
          
          <div className='text-center'>
            <div className='w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold text-xl'>
              3
            </div>
            <h4 className='font-semibold mb-2'>Start Interview</h4>
            <p className='text-sm text-light-100'>Engage in a 6-minute voice conversation with AI</p>
          </div>
          
          <div className='text-center'>
            <div className='w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold text-xl'>
              4
            </div>
            <h4 className='font-semibold mb-2'>Get Feedback</h4>
            <p className='text-sm text-light-100'>Review detailed scores and improvement recommendations</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='mt-20 card p-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          <div>
            <h2 className='text-4xl font-bold text-primary-200'>10K+</h2>
            <p className='text-light-100 mt-2'>Practice Interviews</p>
          </div>
          <div>
            <h2 className='text-4xl font-bold text-primary-200'>95%</h2>
            <p className='text-light-100 mt-2'>User Satisfaction</p>
          </div>
          <div>
            <h2 className='text-4xl font-bold text-primary-200'>6 min</h2>
            <p className='text-light-100 mt-2'>Average Session</p>
          </div>
        </div>
      </section>

      {user && (
        <>
          <section className='flex flex-col gap-6 mt-20'>
            <h2>Your Recent Interviews</h2>
            <div className='interviews-section'>
              {dummyInterviews.slice(0, 3).map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>
              ))}
            </div>
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className='mt-20 py-16 px-4'>
        <div className='container mx-auto max-w-4xl text-center bg-gradient-to-br from-primary-100 to-purple-500 rounded-3xl p-12'>
          <h2 className='text-3xl font-bold mb-4 text-white'>Ready to Ace Your Next Interview?</h2>
          <p className='text-white/90 mb-8 text-lg'>
            Join thousands of candidates improving their skills with AI-powered practice
          </p>
          {user ? (
            <CreateInterviewButton />
          ) : (
            <Button asChild className='bg-white text-primary-100 hover:bg-gray-100 text-lg px-8 py-6'>
              <Link href="/sign-in">
                Get Started Free
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}

export default page