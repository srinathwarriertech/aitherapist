"use server";

import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkOnboardingStatus() {
  try {
    // Try to get current user, but make it optional
    const user = await currentUser().catch(() => null);
    let userId;
    if (user) {
      console.log("id:" + user.id);
      userId = user.id;      
    } else {
      return { success: false, message: "User not found from clerk" };
    }

    const { data, error } = await supabase
      .from('OnboardingFormResponses')
      .select('*')
      .eq('userId', userId);

    if (error) console.log('Error searching for user:' + JSON.stringify(error));
    if (data) console.log('Found data:' + JSON.stringify(data));
    if (data && data.length && data.length > 0) {
      return { success: true, message: "User found successfully", data };
    }else{
      return { success: false, message: "User not found" };
    }
  } catch (e) {
    console.error('Error in checkOnboardingStatus:', e);
    return { success: false, message: "Failed to check onboarding status" };
  }
}