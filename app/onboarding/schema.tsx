// schema.tsx
import type { Schema, Form, Return } from "@formity/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Step,
  Layout,
  Row,
  TextField,
  NumberField,
  YesNo,
  NextButton,
  BackButton,
  Select,
  MultiSelect
} from "@/components/formity";
import SliderField from "@/components/formity/react-hook-form/slider";

import {
  goalsOptions,
  mentalHealthFrequencyOptions,
  genderOptions,
  stressFrequencyOptions,
  priorTherapyOptions,
  medicationOptions,
  sleepQualityOptions,
  appetiteOptions,
  supportOptions,
  exerciseFrequencyOptions,
  preferredSupportOptions,
  selfHarmOptions,
  crisisHelpOptions,
  relationshipOptions
} from "./fields";

import { defaultFormValues } from "./fields";

import { 
  presentingConcernsSchema, 
  demographicsSchema,
  mentalHealthHistorySchema, 
  impactSchema,
  wellbeingLifestyleSchema, 
  goalsPreferencesSchema, 
  safetyScreeningSchema 
  } from "./fields";



export type FormityValues = [
  // 1. Demographics
  Form<{ age: number; gender?: string; occupation?: string; relationshipStatus?: string }>,
  // 2. Presenting Concerns
  Form<{ emotionalState: number; stressFrequency: string }>,
  // 3. Mental Health History
  Form<{ priorTherapy: string; medication: string; pastDiagnosis?: string }>,
  // 4. Wellbeing & Lifestyle
  Form<{ sleepQuality: string; appetite: string; support: string; exerciseFrequency: string }>,
  // 5. Goals & Preferences
  Form<{ goals: string[]; preferredSupport: string }>,
  // 6. Safety Screening
  Form<{ selfHarm: string; crisisHelp?: string }>,
  // 7. Impact of Problems
  Form<{ productivity_impact: number; work_missed: number; relationship_issues: number }>,
  // 8. Mood Frequency
  Form<{ feeling_down: string }>,
  // Return type
  Return<{
    age: number;
    gender?: string;
    occupation?: string;
    relationshipStatus?: string;
    emotionalState: number;
    stressFrequency: string;
    priorTherapy: string;
    medication: string;
    pastDiagnosis?: string;
    sleepQuality: string;
    appetite: string;
    support: string;
    exerciseFrequency: string;
    goals: string[];
    preferredSupport: string;
    selfHarm: string;
    crisisHelp?: string;
    productivity_impact: number;
    work_missed: number;
    relationship_issues: number;
    feeling_down: string;
  }>,
];

export const schema: Schema<FormityValues> = [
  // 1. Demographics
  {
    form: {
      values: () => ({
        age: [defaultFormValues.age, []],
        gender: [defaultFormValues.gender, []],
        occupation: [defaultFormValues.occupation, []],
        relationshipStatus: [defaultFormValues.relationshipStatus, []],
      }),
      render: ({ values, onNext }) => (
        <Step
          key="demographics"
          defaultValues={values}
          resolver={zodResolver(z.object(demographicsSchema))}
          onSubmit={onNext}
        >
          <Layout
            heading="Let's get to know you!"
            description="Please share a few basics about yourself."
            fields={[
              <Row key="age-gender" items={[
                <NumberField key="age" name="age" label="Age" min={10} max={120} />, 
                <Select key="gender" name="gender" label="Gender" options={genderOptions.map((option) => ({ value: option, label: option }))} direction="y" />,
              ]} />,
              <Row key="occupation-status" items={[
                <TextField key="occupation" name="occupation" label="Occupation (optional)" />, 
                <Select key="relationshipStatus" name="relationshipStatus" label="Relationship Status" options={relationshipOptions.map((option) => ({ value: option, label: option }))} direction="y" />,
              ]} />,
            ]}
            button={<NextButton>Next</NextButton>}
          />
        </Step>
      ),
    },
  },
  // 2. Presenting Concerns
  {
    form: {
      values: () => ({
        emotionalState: [defaultFormValues.emotionalState, []],
        stressFrequency: [defaultFormValues.stressFrequency, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="concerns"
          defaultValues={values}
          resolver={zodResolver(
            z.object(presentingConcernsSchema)
          )}
          onSubmit={onNext}
        >
          <Layout
            heading="How are you feeling lately?"
            description="Tell us about your emotional state and stress."
            fields={[
              <SliderField key="emotionalState" name="emotionalState" label="How would you rate your current emotional state?" 
              subLabel="(1 = worst, 10 = best)"
              min={1} max={10} />, 
              <Select key="stressFrequency" name="stressFrequency" label="How often do you feel stressed?" options={[
                { value: "Never", label: "Never" },
                { value: "Rarely", label: "Rarely" },
                { value: "Sometimes", label: "Sometimes" },
                { value: "Often", label: "Often" },
                { value: "Always", label: "Always" },
              ]} direction="y" />,
            ]}
            button={<NextButton>Next</NextButton>}
            back={<BackButton onBack={() => onBack(values)} />}
          />
        </Step>
      ),
    },
  },
  // 3. Mental Health History
  {
    form: {
      values: () => ({
        priorTherapy: [defaultFormValues.priorTherapy, []],
        medication: [defaultFormValues.medication, []],
        pastDiagnosis: [defaultFormValues.pastDiagnosis, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="history"
          defaultValues={values}
          resolver={zodResolver(z.object(mentalHealthHistorySchema))}
          onSubmit={onNext}
        >
          <Layout
            heading="Your Mental Health History"
            description="A few questions about your background."
            fields={[
              <Select key="priorTherapy" name="priorTherapy" label="Have you attended therapy before?" options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Prefer not to say", label: "Prefer not to say" },
              ]} direction="y" />, 
              <Select key="medication" name="medication" label="Are you currently taking medication for mental health?" options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Prefer not to say", label: "Prefer not to say" },
              ]} direction="y" />, 
              <TextField key="pastDiagnosis" name="pastDiagnosis" label="Any past mental health diagnosis? (optional)" />,
            ]}
            button={<NextButton>Next</NextButton>}
            back={<BackButton onBack={() => onBack(values)} />}
          />
        </Step>
      ),
    },
  },
  // 4. Wellbeing & Lifestyle
  {
    form: {
      values: () => ({
        sleepQuality: [defaultFormValues.sleepQuality, []],
        appetite: [defaultFormValues.appetite, []],
        support: [defaultFormValues.support, []],
        exerciseFrequency: [defaultFormValues.exerciseFrequency, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="wellbeing"
          defaultValues={values}
          resolver={zodResolver(z.object(wellbeingLifestyleSchema))}
          onSubmit={onNext}
        >
          <Layout
            heading="Your Wellbeing & Lifestyle"
            description="A few questions about your daily life."
            fields={[
              <Select key="sleepQuality" name="sleepQuality" label="How would you rate your sleep quality?" options={[
                { value: "Poor", label: "Poor" },
                { value: "Fair", label: "Fair" },
                { value: "Good", label: "Good" },
                { value: "Excellent", label: "Excellent" },
              ]} direction="y" />, 
              <Select key="appetite" name="appetite" label="How is your appetite?" options={[
                { value: "Decreased", label: "Decreased" },
                { value: "Normal", label: "Normal" },
                { value: "Increased", label: "Increased" },
              ]} direction="y" />, 
              <Select key="support" name="support" label="Do you have support from friends or family?" options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Somewhat", label: "Somewhat" },
              ]} direction="y" />, 
              <Select key="exerciseFrequency" name="exerciseFrequency" label="How often do you exercise?" options={[
                { value: "Never", label: "Never" },
                { value: "Occasionally", label: "Occasionally" },
                { value: "Regularly", label: "Regularly" },
              ]} direction="y" />,
            ]}
            button={<NextButton>Next</NextButton>}
            back={<BackButton onBack={() => onBack(values)} />}
          />
        </Step>
      ),
    },
  },
  // 5. Goals & Preferences
  {
    form: {
      values: () => ({
        goals: [defaultFormValues.goals, []],
        preferredSupport: [defaultFormValues.preferredSupport, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="goals"
          defaultValues={values}
          resolver={zodResolver(z.object(goalsPreferencesSchema))}
          onSubmit={onNext}
        >
          <Layout
            heading="What are your goals and preferences?"
            description="Select your goals and how you'd like to receive support."
            fields={[
              <MultiSelect
                key="goals"
                name="goals"
                label="Select your goals"
                options={goalsOptions.map(({ id, label }) => ({ value: id, label }))}
                direction="y"
              />, 
              <Select
                key="preferredSupport"
                name="preferredSupport"
                label="Preferred support mode"
                options={[
                  { value: "Chat", label: "Chat with AI Therapist" },
                  { value: "Self-help resources", label: "Self-help resources" },
                  { value: "Both", label: "Both" },
                ]}
                direction="y"
              />,
            ]}
            button={<NextButton>Next</NextButton>}
            back={<BackButton onBack={() => onBack(values)} />}
          />
        </Step>
      ),
    },
  },
  // 6. Safety Screening
  {
    form: {
      values: () => ({
        selfHarm: [defaultFormValues.selfHarm, []],
        crisisHelp: [defaultFormValues.crisisHelp, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="safety"
          defaultValues={values}
          resolver={zodResolver(z.object(safetyScreeningSchema))}
          onSubmit={onNext}
        >
          <Layout
            heading="Safety Check"
            description="These questions help us keep you safe."
            fields={[
              <Select key="selfHarm" name="selfHarm" label="Have you had thoughts of self-harm recently?" options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Prefer not to say", label: "Prefer not to say" },
              ]} direction="y" />, 
              <Select key="crisisHelp" name="crisisHelp" label="Are you currently in crisis or need immediate help?" options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]} direction="y" />,
            ]}
            button={<NextButton>Next</NextButton>}
            back={<BackButton onBack={() => onBack(values)} />}
          />
        </Step>
      ),
    },
  },
  // 7. Impact of Problems
  {
    form: {
      values: () => ({
        productivity_impact: [defaultFormValues.productivity_impact, []],
        work_missed: [defaultFormValues.work_missed, []],
        relationship_issues: [defaultFormValues.relationship_issues, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="impact"
          defaultValues={values}
          resolver={zodResolver(z.object(impactSchema
          //   {
          //   productivity_impact: z.number().min(0).max(7),
          //   work_missed: z.number().min(0).max(7),
          //   relationship_issues: z.number().min(0).max(7),
          // }
        ))}
          onSubmit={onNext}
        >
          <Layout
            heading="How have your problems impacted you?"
            description="In the past week, how many days have physical or mental health problems caused you to... (0-7 days)"
            fields={[
              <SliderField key="productivity_impact" name="productivity_impact" label="Be less productive at work" />, 
              <SliderField key="work_missed" name="work_missed" label="Miss work or not carry out daily responsibilities" />, 
              <SliderField key="relationship_issues" name="relationship_issues" label="Experience relationship issues with family/friends" />, 
            ]}
            button={<NextButton>Next</NextButton>}
            back={<BackButton onBack={() => onBack(values)} />}
          />
        </Step>
      ),
    },
  },
  // 8. Mood Frequency
  {
    form: {
      values: () => ({
        feeling_down: [defaultFormValues.feeling_down, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="feeling_down"
          defaultValues={values}
          resolver={zodResolver(z.object({
            feeling_down: z.string().min(1, { message: "Please select an option" }),
          }))}
          onSubmit={onNext}
        >
          <Layout
            heading="How often have you been feeling down?"
            description="In the past week, how often have you been bothered by feeling down, depressed, or hopeless?"
            fields={[
              <Select
                key="feeling_down"
                name="feeling_down"
                label=""
                options={mentalHealthFrequencyOptions.map(({ id, label }) => ({ value: id, label }))}
                direction="y"
              />, 
            ]}
            button={<NextButton>Submit</NextButton>}
            back={<BackButton onBack={() => onBack(values)} />}
          />
        </Step>
      ),
    },
  },
  // Return step
  {
    return: ({
      age, gender, occupation, relationshipStatus,
      emotionalState, stressFrequency,
      priorTherapy, medication, pastDiagnosis,
      sleepQuality, appetite, support, exerciseFrequency,
      goals, preferredSupport,
      selfHarm, crisisHelp,
      productivity_impact, work_missed, relationship_issues,
      feeling_down,
    }) => ({
      age, gender, occupation, relationshipStatus,
      emotionalState, stressFrequency,
      priorTherapy, medication, pastDiagnosis,
      sleepQuality, appetite, support, exerciseFrequency,
      goals, preferredSupport,
      selfHarm, crisisHelp,
      productivity_impact, work_missed, relationship_issues,
      feeling_down,
    }),
  },
];