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


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);


const goals = [
  {
    id: "feel_happier",
    label: "Feel happier again",
  },
  {
    id: "regain_interest",
    label: "Regain interest in activities I used to enjoy",
  },
  {
    id: "feel_relaxed",
    label: "Feel more relaxed and in control",
  },
  {
    id: "improve_sleep",
    label: "Improve my sleep",
  },
  {
    id: "reduce_alcohol",
    label: "Reduce my use of alcohol",
  },
  {
    id: "reduce_smoking",
    label: "Reduce my use of smoking, vaping or chew",
  },
  {
    id: "reduce_drugs",
    label: "Reduce my use of drugs",
  },
] as const

export const formSchema = z.object({
  // Demographics
  age: z.number().min(10).max(120),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  relationshipStatus: z.string().optional(),

  // Presenting Concerns
  emotionalState: z.number().min(1).max(10),
  stressFrequency: z.enum(["Never", "Rarely", "Sometimes", "Often", "Always"]),

  // Mental Health History
  priorTherapy: z.enum(["Yes", "No", "Prefer not to say"]),
  medication: z.enum(["Yes", "No", "Prefer not to say"]),
  pastDiagnosis: z.string().optional(),

  // Wellbeing & Lifestyle
  sleepQuality: z.enum(["Poor", "Fair", "Good", "Excellent"]),
  appetite: z.enum(["Decreased", "Normal", "Increased"]),
  support: z.enum(["Yes", "No", "Somewhat"]),
  exerciseFrequency: z.enum(["Never", "Occasionally", "Regularly"]),

  // Goals & Preferences
  goals: z.array(z.string()).min(1, { message: "Please select at least one goal" }),
  preferredSupport: z.enum(["Chat", "Self-help resources", "Both"]),

  // Safety Screening
  selfHarm: z.enum(["Yes", "No", "Prefer not to say"]),
  crisisHelp: z.enum(["Yes", "No"]).optional(),

  // Existing fields
  productivity_impact: z.number().min(0).max(7),
  work_missed: z.number().min(0).max(7),
  relationship_issues: z.number().min(0).max(7),
  feeling_down: z.string().min(1, { message: "Please select an option" }),
  userId: z.string(),
})

export default function ProfileForm() {
  const { isLoaded, isSignedIn, user } = useUser();
  // 1. Define your form.
  const [isNavigating, setIsNavigating] = useState(false);
  // 1. Define your form.
  const [page, setPage] = useState(1)
  const [mentalHealthFrequency, setMentalHealthFrequency] = useState([
    { id: "not_at_all", label: "Not at all" },
    { id: "several_days", label: "Several days" },
    { id: "more_than_half", label: "More than half the days" },
    { id: "nearly_every_day", label: "Nearly every day" },
  ])
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>({
  // Demographics
  age: 25,
  gender: '',
  occupation: '',
  relationshipStatus: '',
  
  emotionalState: 5,
  stressFrequency: 'Sometimes' as 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always',
  // Mental Health History
  priorTherapy: 'No' as 'Yes' | 'No' | 'Prefer not to say',
  medication: 'No' as 'Yes' | 'No' | 'Prefer not to say',
  pastDiagnosis: '',
  // Wellbeing & Lifestyle
  sleepQuality: 'Good' as 'Poor' | 'Fair' | 'Good' | 'Excellent',
  appetite: 'Normal' as 'Decreased' | 'Normal' | 'Increased',
  support: 'Yes' as 'Yes' | 'No' | 'Somewhat',
  exerciseFrequency: 'Occasionally' as 'Never' | 'Occasionally' | 'Regularly',
  // Goals & Preferences
  goals: [] as string[],
  preferredSupport: 'Chat' as 'Chat' | 'Self-help resources' | 'Both',
  // Safety Screening
  selfHarm: 'No' as 'Yes' | 'No' | 'Prefer not to say',
  crisisHelp: 'No' as 'Yes' | 'No',
  // Existing fields
  productivity_impact: 0,
  work_missed: 0,
  relationship_issues: 0,
  feeling_down: '',
  userId: '',
})
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formValues,
      userId: user?.id || "",
    },
  });
  const router = useRouter()
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Inside onSubmit", values)
      setFormValues({
        ...values,
        gender: values.gender ?? '',
        occupation: values.occupation ?? '',
        relationshipStatus: values.relationshipStatus ?? '',
        pastDiagnosis: values.pastDiagnosis ?? '',
        feeling_down: values.feeling_down ?? '',
        userId: values.userId ?? '',
      })
      console.log(values)
      setIsNavigating(true);
      const result = await onboardingFormSubmit(values);
      
      if (!result.success) {
        setIsNavigating(false);
        return;
      }
      
      // Process onboarding responses to generate result sections
      const resultSections = processOnboardingResponses(values);

      // Store form data and results in sessionStorage before redirecting
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboardingData', JSON.stringify(values));
        sessionStorage.setItem('onboardingResults', JSON.stringify(resultSections));
      }
      
      // Reset the form state so it works on next visit
      form.reset();
      router.push('/results')
    } catch (error) {
      console.error('Submission error:', error);
      setIsNavigating(false);
    }
  }

  const [formityValues, setFormityValues] = useState<ReturnOutput<FormityValues> | null>(null);
  const onReturn = useCallback<OnReturn<FormityValues>>((values) => {
    setFormityValues(values);
  }, []);

  if (formityValues) {
    return <Data data={formityValues} onStart={() => setFormityValues(null)} />;
  }


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
      <div className="onboarding-card">
        {/* Global error summary */}
        {/* {Object.keys(form.formState.errors).length > 0 && (
          <div className="mb-4 p-4 bg-black bg-opacity-60 border border-red-400 rounded text-red-500">
            <strong>Please fix the following errors:</strong>
            <ul className="list-disc ml-6 mt-2">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  {error?.message || `${field} is required`}
                </li>
              ))}
            </ul>
          </div>
        )} */}
        {/* // Add formity multi page Form */}
        <Formity<FormityValues> schema={schema} onReturn={onReturn} />        
      </div>
    </div>
  )
}
