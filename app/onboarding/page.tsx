"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js';
import { useRouter } from "next/navigation"
import { onboardingFormSubmit } from './actions'
import { processOnboardingResponses } from './onboardingAlgorithm'
import { useUser } from "@clerk/nextjs";


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

  const nextPage = () => {
    setPage(prev => prev + 1)
  }

  const previousPage = () => {
    setPage(prev => prev - 1)
  }

  // Scroll to first error on validation fail
  // useEffect(() => {
  //   if (Object.keys(form.formState.errors).length > 0) {
  //     const errorField = Object.keys(form.formState.errors)[0];
  //     const errorElement = document.querySelector(`[name="${errorField}"]`);
  //     if (errorElement) {
  //       errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //     }
  //   }
  // }, [form.formState.errors]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 relative">
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#5940A8] border-solid"></div>
          <span className="ml-4 text-xl font-semibold text-[#5940A8]">Generating Care Plan...</span>
        </div>
      )}
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        {/* Global error summary */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded text-red-700">
            <strong>Please fix the following errors:</strong>
            <ul className="list-disc ml-6 mt-2">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  {error?.message || `${field} is required`}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Step {page} of 3</span>
            <span>{Math.round((page / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(page / 3) * 100}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => { console.log('Form submit triggered', values); return onSubmit(values); })} className="space-y-8">
            <div className="min-h-[400px]"> {/* Fixed height container for form content */}
              {page === 1 && (
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem className="animate-fadeIn">
                      <FormLabel className="text-xl font-semibold mb-6">
                        What are some goals you would like to achieve while using Airoh?
                      </FormLabel>
                      <div className="space-y-4 mt-4">
                        {goals.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-center space-x-3 p-3 rounded-lg"
                          >
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...field.value, item.id]
                                  : field.value?.filter((value) => value !== item.id)
                                field.onChange(updatedValue)
                              }}
                            />
                            <FormLabel className="font-normal text-base">
                              {item.label}
                            </FormLabel>
                          </div>
                        ))}
                      </div>
                      <FormMessage className="mt-2 text-red-500" />
                    </FormItem>
                  )}
                />
              )}

              {page === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold mb-6">
                    In the past week, how many days have physical or mental health problems in your life caused you to...
                  </h3>

                  {/* Existing slider fields with enhanced styling */}
                  <FormField
                    control={form.control}
                    name="productivity_impact"
                    render={({ field }) => (
                      <FormItem className="bg-gray-50 p-4 rounded-lg">
                        <FormLabel className="text-base font-medium">Be less productive at work</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-4 mt-2">
                            <Slider
                              min={0}
                              max={7}
                              step={1}
                              value={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              className="py-4"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>0 days</span>
                              <span>7 days</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm font-medium text-blue-600">
                          Selected: {field.value} days
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="work_missed"
                    render={({ field }) => (
                      <FormItem className="bg-gray-50 p-4 rounded-lg">
                        <FormLabel className="text-base font-medium">Miss work or not carry out daily work-related responsibilities</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-4 mt-2">
                            <Slider
                              min={0}
                              max={7}
                              step={1}
                              value={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              className="py-4"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>0 days</span>
                              <span>7 days</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm font-medium text-blue-600">
                          Selected: {field.value} days
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="relationship_issues"
                    render={({ field }) => (
                      <FormItem className="bg-gray-50 p-4 rounded-lg">
                        <FormLabel className="text-base font-medium">Experience relationship issues with family and/or friends</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-4 mt-2">
                            <Slider
                              min={0}
                              max={7}
                              step={1}
                              value={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              className="py-4"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>0 days</span>
                              <span>7 days</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm font-medium text-blue-600">
                          Selected: {field.value} days
                        </FormDescription>
                      </FormItem>
                    )}
                  />



                </div>
              )}

              {page === 3 && (
                <FormField
                  control={form.control}
                  name="feeling_down"
                  render={({ field }) => (
                    <FormItem className="space-y-4 animate-fadeIn">
                      <FormLabel className="text-xl font-semibold">
                        How often have you been bothered by feeling down, depressed, or hopeless?
                      </FormLabel>
                      <div className="space-y-3 mt-4">
                        {mentalHealthFrequency.map((option) => (
                          <div 
                            key={option.id} 
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                              ${field.value === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => field.onChange(option.id)}
                          >
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-blue-600"
                              id={option.id}
                              {...field}
                              value={option.id}
                              checked={field.value === option.id}
                            />
                            <label htmlFor={option.id} className="text-base font-medium cursor-pointer flex-grow">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-between pt-6 border-t">
              {page > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={previousPage}
                  className="px-6"
                >
                  ← Previous
                </Button>
              )}
              
              {page < 3 ? (
                <Button 
                  type="button" 
                  onClick={nextPage}
                  className="ml-auto px-6"
                >
                  Next →
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="ml-auto px-8 bg-blue-600 hover:bg-blue-700"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
