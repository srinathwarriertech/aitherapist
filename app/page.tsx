'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { checkOnboardingStatus } from './actions';

import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user, isLoaded } = useUser();
  // const { userId } = useAuth();
  const userId = user?.id;
  const [href, setHref] = useState('/onboarding');

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await checkOnboardingStatus();
        const { success } = res;
        console.log('Onboarding check result:', success);
        setHref(success ? '/home' : '/onboarding');
      } catch (error) {
        console.error('Onboarding check failed:', error);
      }
    };

    if (userId) checkOnboarding();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {isLoaded && user ? (
        <h1 className="text-4xl font-normal mb-8 text-primary">Hi {user.firstName}, Welcome to Airoh</h1>
      ) : (
        <h1 className="text-4xl font-normal mb-8 text-primary">Welcome to Airoh</h1>
      )}
      <div className="space-x-4">
        {/* <Button asChild>
          <Link href="/employee/login">Employee Login</Link>
        </Button>
        <Button asChild>
          <Link href="/maya">Maya</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/login">Admin Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/employee/questionnaire">Questionnaire</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/employee/dashboard2">Dashboard</Link>
        </Button> */}
        <Button asChild variant="outline">
          <Link href={href}>Get Started</Link>
        </Button>
      </div>
    </div>
  );
}