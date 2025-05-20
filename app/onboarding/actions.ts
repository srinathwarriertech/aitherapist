"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server'
import { FormityResponse } from "./fields";
import { processUserOnboarding } from "./scoringAlgorithm";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function onboardingFormSubmit(
  values: FormityResponse
) {
  try {
    // Try to get current user, but make it optional
    const user = await currentUser().catch(() => null);
    let userId;
    if (user) {
      console.log("id:" + user.id);
      userId = user.id;      
    } else {
      // Use a default ID if no user is available
      userId = 'anonymous-' + Date.now().toString();
    }

    const { data, error } = await supabase
      .from('OnboardingFormResponses')
      .insert({ onboardingResponse: values , userId:userId })
      .select();

    if (error) console.log('Error inserting data:' + JSON.stringify(error));
    if (data) console.log('Inserted data:' + JSON.stringify(data));

    //Test running the scoring algorithm
    const {scores,interventionPlan,goals,userProfile} = processUserOnboarding(values);
    console.log('Scores:', scores);
    console.log('Intervention Plan:', interventionPlan);
    console.log('User Profile:', userProfile);
    
    return { success: !error, message: error ? "Failed to save data" : "Data saved successfully", scores, interventionPlan, userProfile,goals };
  } catch (e) {
    console.error('Error in onboardingFormSubmit:', e);
    return { success: false, message: "Failed to insert onboardingform" };
  }
}