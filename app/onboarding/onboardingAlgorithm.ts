// onboardingAlgorithm.ts
// Algorithm for mapping onboarding responses to result sections in the AI Therapist app

export type OnboardingResponse = {
  age?: number;
  gender?: string;
  occupation?: string;
  relationshipStatus?: string;
  presentingConcerns?: string[];
  emotionalState?: number;
  stressFrequency?: "Never" | "Rarely" | "Sometimes" | "Often" | "Always";
  priorTherapy?: "Yes" | "No" | "Prefer not to say";
  medication?: string;
  pastDiagnosis?: string;
  sleepQuality?: string;
  appetite?: string;
  support?: string;
  exerciseFrequency?: string;
  goals?: string[];
  preferredSupport?: string;
  selfHarm?: string;
  crisisHelp?: string;
  // Add any additional fields as needed
  [key: string]: any;
};

export type ResultSection = {
  id: string; // goal id
  title: string;
  description: string;
};
// Map goal IDs to user-friendly labels
export const goalLabels: Record<string, string> = {
  feel_happier: 'Feel happier again',
  regain_interest: 'Regain interest in activities I used to enjoy',
  feel_relaxed: 'Feel more relaxed and in control',
  improve_sleep: 'Improve my sleep',
  reduce_alcohol: 'Reduce my use of alcohol',
  reduce_smoking: 'Reduce my use of smoking, vaping or chew',
  reduce_drugs: 'Reduce my use of drugs',
};

export function processOnboardingResponses(responses: OnboardingResponse): ResultSection[] {
  const tags: string[] = [];
  const scores: Record<string, number> = {};
  const addScore = (key: string, value: number) => {
    scores[key] = (scores[key] || 0) + value;
  };

  // Scoring logic
  if (responses.stressFrequency && ["Often", "Always"].includes(responses.stressFrequency)) {
    tags.push("stress");
    addScore("stress", 2);
  }
  if (responses.sleepQuality === "Poor") {
    tags.push("sleep");
    addScore("sleep", 1);
  }
  if (responses.support === "No") {
    tags.push("isolation");
    addScore("isolation", 1);
  }
  if (responses.selfHarm === "Yes") {
    tags.push("crisis");
  }
  // Expand with more mappings as needed

  // Example: Map presenting concerns
  if (Array.isArray(responses.presentingConcerns)) {
    responses.presentingConcerns.forEach((concern: string) => {
      tags.push(concern.toLowerCase());
      addScore(concern.toLowerCase(), 1);
    });
  }

  // Generate result sections
  const resultSections: ResultSection[] = [];
  if (tags.includes("crisis")) {
    resultSections.push({
      id: "crisis",
      title: "Immediate Support",
      description:
        "It looks like you may need urgent support. Please consider reaching out to a professional or using the resources provided here. Your safety is important!",
    });
  }
  if ((scores["stress"] || 0) >= 2) {
    resultSections.push({
      id: "stress",
      title: "Managing Stress",
      description:
        "You reported experiencing frequent stress. Here are some strategies and resources that may help you manage stress more effectively.",
    });
  }
  if ((scores["sleep"] || 0) >= 1) {
    resultSections.push({
      id: "sleep",
      title: "Improving Sleep",
      description:
        "Sleep quality can greatly impact your well-being. Explore these tips and resources to help improve your sleep habits.",
    });
  }
  if ((scores["isolation"] || 0) >= 1) {
    resultSections.push({
      id: "isolation",
      title: "Building Support",
      description:
        "Supportive relationships are important. Consider reaching out to friends, family, or support groups for connection.",
    });
  }
  // Add more sections as needed based on scores/tags


  if (Array.isArray(responses.goals)) {
    responses.goals.forEach((goal: string) => {
      const label = goalLabels[goal] || goal;
      resultSections.push({
        id: goal,
        title: `Goal: ${label}`,
        description: `Here are some ways you can work towards your goal: ${label}.`,
      });
    });
  }

  return resultSections;
}
