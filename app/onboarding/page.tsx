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
import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material';
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
    console.log("result", result);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('onboardingData', JSON.stringify(values));
      // Store scores, interventionPlan, userProfile in onboardingResults
      sessionStorage.setItem('onboardingResults', JSON.stringify({
        scores: result.scores,
        interventionPlan: result.interventionPlan,
        userProfile: result.userProfile
      }));
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
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      py: 4,
      background: theme => `linear-gradient(to bottom, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
    }}>
      {isNavigating && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          opacity: 0.9
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ ml: 2, color: 'primary.main' }}>
            Generating Care Plan...
          </Typography>
        </Box>
      )}
      <Container maxWidth="md" sx={{ position: 'relative', p: 4 }}>
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Box sx={{ 
            '& .onboarding-card': {
              padding: 3,
              borderRadius: '16px',
              backgroundColor: 'background.paper'
            }
          }}>
            <Formity<FormityValues> schema={schema} onReturn={onReturn} />
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
