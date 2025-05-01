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


// --- Page 1 goals array (from page.tsx) ---
const goals = [
  { id: "feel_happier", label: "Feel happier again" },
  { id: "regain_interest", label: "Regain interest in activities I used to enjoy" },
  { id: "feel_relaxed", label: "Feel more relaxed and in control" },
  { id: "improve_sleep", label: "Improve my sleep" },
  { id: "reduce_alcohol", label: "Reduce my use of alcohol" },
  { id: "reduce_smoking", label: "Reduce my use of smoking, vaping or chew" },
  { id: "reduce_drugs", label: "Reduce my use of drugs" },
] as const;

// --- Page 3 mentalHealthFrequency array (from page.tsx) ---
const mentalHealthFrequency = [
  { id: "not_at_all", label: "Not at all" },
  { id: "several_days", label: "Several days" },
  { id: "more_than_half", label: "More than half the days" },
  { id: "nearly_every_day", label: "Nearly every day" },
];

export type FormityValues = [
  Form<{ goals: string[] }>,
  Form<{ productivity_impact: number; work_missed: number; relationship_issues: number }>,
  Form<{ feeling_down: string }>,
  Return<{
    goals: string[];
    productivity_impact: number;
    work_missed: number;
    relationship_issues: number;
    feeling_down: string;
  }>,
];

export const schema: Schema<FormityValues> = [
  // Page 1: MultiSelect for goals
  {
    form: {
      values: () => ({
        goals: [[], []],
      }),
      render: ({ values, onNext }) => (
        <Step
          key="goals"
          defaultValues={values}
          resolver={zodResolver(
            z.object({
              goals: z.array(z.string()).min(1, { message: "Please select at least one goal" }),
            })
          )}
          onSubmit={onNext}
        >
          <Layout
            heading="What are some goals you would like to achieve while using Airoh?"
            description="Select all that apply."
            fields={[
              <Row
                key="goals"
                items={[
                  <MultiSelect
                    key="goals"
                    name="goals"
                    label=""
                    options={goals.map(({ id, label }) => ({ value: id, label }))}
                    direction="y"
                  />,
                ]}
              />,
            ]}
            button={<NextButton>Next</NextButton>}
          />
        </Step>
      ),
    },
  },
  // Page 2: 3 sliders for productivity_impact, work_missed, relationship_issues
  {
    form: {
      values: () => ({
        productivity_impact: [0, []],
        work_missed: [0, []],
        relationship_issues: [0, []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="impact"
          defaultValues={values}
          resolver={zodResolver(
            z.object({
              productivity_impact: z.number().min(0).max(7),
              work_missed: z.number().min(0).max(7),
              relationship_issues: z.number().min(0).max(7),
            })
          )}
          onSubmit={onNext}
        >
          <Layout
            heading="In the past week, how many days have physical or mental health problems in your life caused you to..."
            description="Use the sliders to indicate the number of days (0-7)."
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
  // Page 3: SingleSelect for feeling_down
  {
    form: {
      values: () => ({
        feeling_down: ["", []],
      }),
      render: ({ values, onNext, onBack }) => (
        <Step
          key="feeling_down"
          defaultValues={values}
          resolver={zodResolver(
            z.object({
              feeling_down: z.string().min(1, { message: "Please select an option" }),
            })
          )}
          onSubmit={onNext}
        >
          <Layout
            heading="In the past week, How often have you been bothered by feeling down, depressed, or hopeless?"
            description=""
            fields={[
              <Select
                key="feeling_down"
                name="feeling_down"
                label=""
                options={mentalHealthFrequency.map(({ id, label }) => ({ value: id, label }))}
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
  {
    return: ({ goals, productivity_impact, work_missed, relationship_issues, feeling_down }) => ({
      goals,
      productivity_impact,
      work_missed,
      relationship_issues,
      feeling_down,
    }),
  },
];