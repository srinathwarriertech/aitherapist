// Centralized field value arrays and Zod fragments for onboarding forms
import { z } from "zod";

export const goalsOptions = [
  { id: "feel_happier", label: "Feel happier again" },
  { id: "regain_interest", label: "Regain interest in activities I used to enjoy" },
  { id: "feel_relaxed", label: "Feel more relaxed and in control" },
  { id: "improve_sleep", label: "Improve my sleep" },
  { id: "reduce_alcohol", label: "Reduce my use of alcohol" },
  { id: "reduce_smoking", label: "Reduce my use of smoking, vaping or chew" },
  { id: "reduce_drugs", label: "Reduce my use of drugs" },
] as const;

export const mentalHealthFrequencyOptions = [
  { id: "not_at_all", label: "Not at all" },
  { id: "several_days", label: "Several days" },
  { id: "more_than_half", label: "More than half the days" },
  { id: "nearly_every_day", label: "Nearly every day" },
];



// Enum value arrays
export const genderOptions = ["Male", "Female", "Other", "Prefer not to say"] as const;
export const relationshipOptions = ["Single", "In a relationship", "Married", "Prefer not to say"] as const;
export const stressFrequencyOptions = ["Never", "Rarely", "Sometimes", "Often", "Always"] as const;
export const priorTherapyOptions = ["Yes", "No", "Prefer not to say"] as const;
export const medicationOptions = ["Yes", "No", "Prefer not to say"] as const;
export const sleepQualityOptions = ["Poor", "Fair", "Good", "Excellent"] as const;
export const appetiteOptions = ["Decreased", "Normal", "Increased"] as const;
export const supportOptions = ["Yes", "No", "Somewhat"] as const;
export const exerciseFrequencyOptions = ["Never", "Occasionally", "Regularly"] as const;
export const preferredSupportOptions = ["Chat", "Self-help resources", "Both"] as const;
export const selfHarmOptions = ["Yes", "No", "Prefer not to say"] as const;
export const crisisHelpOptions = ["Yes", "No"] as const;

// Default values
export const defaultFormValues = {
  // Demographics
    age: 25,
    gender: 'Male',
    occupation: '',
    relationshipStatus: 'Single',
  
    emotionalState: 5,
    stressFrequency: stressFrequencyOptions[2],
    // Mental Health History
    priorTherapy: priorTherapyOptions[1],
    medication: medicationOptions[1],
    pastDiagnosis: '',
    // Wellbeing & Lifestyle
    sleepQuality: sleepQualityOptions[2],
    appetite: appetiteOptions[1],
    support: supportOptions[0],
    exerciseFrequency: exerciseFrequencyOptions[1],
    // Goals & Preferences
    goals: [],
    preferredSupport: preferredSupportOptions[0],
    // Safety Screening
    selfHarm: selfHarmOptions[1],
    crisisHelp: crisisHelpOptions[1],
    // Existing fields
    productivity_impact: 0,
    work_missed: 0,
    relationship_issues: 0,
    feeling_down: '',
    userId: ''
}

// Zod fragments for reuse

export const demographicsSchema = {
  age: z.number().min(10).max(120),
  gender: z.enum(genderOptions),
  occupation: z.string().optional(),
  relationshipStatus: z.enum(relationshipOptions),
};

export const presentingConcernsSchema = {
  emotionalState: z.number().min(1).max(10),
  stressFrequency: z.enum(stressFrequencyOptions),
};

export const mentalHealthHistorySchema = {
  priorTherapy: z.enum(priorTherapyOptions),
  medication: z.enum(medicationOptions),
  pastDiagnosis: z.string().optional(),
};

export const wellbeingLifestyleSchema = {
  sleepQuality: z.enum(sleepQualityOptions),
  appetite: z.enum(appetiteOptions),
  support: z.enum(supportOptions),
  exerciseFrequency: z.enum(exerciseFrequencyOptions),
};

export const goalsPreferencesSchema = {
  goals: z.array(z.string()).min(1, { message: "Please select at least one goal" }),
  preferredSupport: z.enum(preferredSupportOptions),
};

export const safetyScreeningSchema = {
  selfHarm: z.enum(selfHarmOptions),
  crisisHelp: z.enum(crisisHelpOptions).optional(),
};

export const impactSchema = {
  productivity_impact: z.number().min(0).max(7),
  work_missed: z.number().min(0).max(7),
  relationship_issues: z.number().min(0).max(7),
};
