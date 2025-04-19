"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { createClient } from '@supabase/supabase-js';
import { useRouter } from "next/navigation"
import { onboardingFormSubmit} from './actions'


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

const mentalHealthFrequency = [
  { id: "not_at_all", label: "Not at all" },
  { id: "several_days", label: "Several days" },
  { id: "more_than_half", label: "More than half the days" },
  { id: "nearly_every_day", label: "Nearly every day" },
] as const

export const formSchema = z.object({
  goals: z.array(z.string()).min(1, { message: "Please select at least one goal" }),
  productivity_impact: z.number().min(0).max(7),
  work_missed: z.number().min(0).max(7),
  relationship_issues: z.number().min(0).max(7),
  feeling_down: z.string().min(1, { message: "Please select an option" }),
  userId: z.string(),
})

export default function ProfileForm() {
  // 1. Define your form.
  const [page, setPage] = useState(1)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: [],
      productivity_impact: 0,
      work_missed: 0,
      relationship_issues: 0,
      feeling_down: "",
      userId: "",
    },
  })
  const router = useRouter()
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)


    await onboardingFormSubmit(values);

    router.push('/chat')
  }

  const nextPage = () => {
    setPage(prev => prev + 1)
  }

  const previousPage = () => {
    setPage(prev => prev - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="min-h-[400px]"> {/* Fixed height container for form content */}
              {page === 1 && (
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem className="animate-fadeIn">
                      <FormLabel className="text-xl font-semibold mb-6">
                        What are some goals you would like to achieve while using Neuroliving?
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
