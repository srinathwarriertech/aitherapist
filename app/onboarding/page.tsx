"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Values, z } from "zod"
import { useState, useEffect ,useCallback} from "react"
import { createClient } from '@supabase/supabase-js';
import { useRouter } from "next/navigation"
import { onboardingFormSubmit } from './actions'
import { processOnboardingResponses } from './onboardingAlgorithm'
import { useUser } from "@clerk/nextjs";
import { Formity, OnReturn, ReturnOutput } from "@formity/react";
import { Data } from "@/components/formity";
import { schema, FormityValues } from "./schema";
import "./main.css";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import BackButton from "@/components/formity/navigation/back-button"
import {
  goalsOptions,
  mentalHealthFrequencyOptions,
  stressFrequencyOptions,
  priorTherapyOptions,
  medicationOptions,
  sleepQualityOptions,
  appetiteOptions,
  supportOptions,
  exerciseFrequencyOptions,
  preferredSupportOptions,
  selfHarmOptions,
  crisisHelpOptions
} from "./fields";

import { defaultFormValues } from "./fields";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);




export default function ProfileForm() {
  const { isLoaded, isSignedIn, user } = useUser();
  // 1. Define your form.
  const [isNavigating, setIsNavigating] = useState(false);
  
  


  const router = useRouter()
 


  // Remove duplicate router declaration
const onReturn = useCallback<OnReturn<FormityValues>>(async (values) => {
  try {
    console.log("Inside onReturn values:", values)
    const result = await onboardingFormSubmit(values);
    console.log("result", result)
    // Generate results for sessionStorage
    const resultSections = processOnboardingResponses(values);
    console.log("resultSections", resultSections)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('onboardingData', JSON.stringify(values));
      sessionStorage.setItem('onboardingResults', JSON.stringify(resultSections));
    }
    router.push('/results');
  } catch (error) {
    console.error('Formity submission error:', error);
  }
}, [router]);


  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl">Loading user...</span>
      </div>
    );
  }
  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl text-red-600">You must be signed in to continue.</span>
      </div>
    );
  }

  return (
    <div className="onboarding-bg">
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#5940A8] border-solid"></div>
          <span className="ml-4 text-xl font-semibold text-[#5940A8]">Generating Care Plan...</span>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 relative">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="onboarding-card">
            {/* // Add formity multi page Form */}
            <Formity<FormityValues> schema={schema} onReturn={onReturn} />        
          </div>
        </div>
      </div>
    </div>
  )
}
