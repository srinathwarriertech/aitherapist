/**
 * AI Therapist Scoring Algorithm
 * 
 * This algorithm processes onboarding responses to generate scores across
 * multiple assessment categories. These scores are used to determine
 * the appropriate therapeutic approach and resource allocation.
 */

import { FormityResponse } from "./fields";
export function calculateTherapyScores(responses:FormityResponse) {
    // Initialize score categories
    const scores = {
      riskLevel: 0,            // Range: 0-100 (0: Low risk, 100: Immediate intervention)
      depressionSeverity: 0,   // Range: 0-100 (0: Minimal, 100: Severe)
      anxietySeverity: 0,      // Range: 0-100 (0: Minimal, 100: Severe)
      lifestyleImpact: 0,      // Range: 0-100 (0: Minimal impact, 100: Severe impact)
      copingCapacity: 100,     // Range: 0-100 (0: Poor coping, 100: Strong coping)
      socialSupport: 100,      // Range: 0-100 (0: Isolated, 100: Well-supported)
      treatmentReadiness: 0,   // Range: 0-100 (0: Not ready, 100: Highly engaged)
      wellbeingIndex: 0        // Range: 0-100 (0: Poor wellbeing, 100: Excellent wellbeing)
    };
  
    // RISK LEVEL ASSESSMENT
    // ---------------------
    
    // Crisis & Self-harm Risk Check (Safety Screening)
    if (responses.selfHarm === "Yes") {
      scores.riskLevel += 60;
    } else if (responses.selfHarm === "Prefer not to say") {
      scores.riskLevel += 30;
    }
    
    if (responses.crisisHelp === "Yes") {
      scores.riskLevel += 70;
    }
    
    // Emotional State Risk Check
    if (responses.emotionalState <= 3) {
      scores.riskLevel += 20;
    } else if (responses.emotionalState <= 5) {
      scores.riskLevel += 10;
    }
    
    // Feeling Down Frequency Risk Check
    if (responses.feeling_down === "Nearly every day") {
      scores.riskLevel += 20;
      scores.depressionSeverity += 40;
    } else if (responses.feeling_down === "More than half") {
      scores.riskLevel += 15;
      scores.depressionSeverity += 30;
    } else if (responses.feeling_down === "Several days") {
      scores.riskLevel += 5;
      scores.depressionSeverity += 15;
    }
    
    // Impact Assessment Risk Check
    const totalImpactDays = responses.productivity_impact + responses.work_missed + responses.relationship_issues;
    if (totalImpactDays >= 15) {
      scores.riskLevel += 15;
      scores.lifestyleImpact += 40;
    } else if (totalImpactDays >= 10) {
      scores.riskLevel += 10;
      scores.lifestyleImpact += 30;
    } else if (totalImpactDays >= 5) {
      scores.riskLevel += 5;
      scores.lifestyleImpact += 20;
    } else {
      scores.lifestyleImpact += 10;
    }
    
    // DEPRESSION SEVERITY
    // ------------------
    
    // Emotional State Depression Check
    if (responses.emotionalState <= 3) {
      scores.depressionSeverity += 30;
    } else if (responses.emotionalState <= 5) {
      scores.depressionSeverity += 20;
    } else if (responses.emotionalState <= 7) {
      scores.depressionSeverity += 10;
    }
    
    // Sleep & Appetite Depression Indicators
    if (responses.sleepQuality === "Poor") {
      scores.depressionSeverity += 15;
      scores.wellbeingIndex -= 20;
    } else if (responses.sleepQuality === "Fair") {
      scores.depressionSeverity += 5;
      scores.wellbeingIndex -= 10;
    }
    
    if (responses.appetite === "Decreased") {
      scores.depressionSeverity += 15;
      scores.wellbeingIndex -= 15;
    } else if (responses.appetite === "Increased") {
      scores.depressionSeverity += 10; // Can also indicate depression
      scores.wellbeingIndex -= 10;
    }
    
    // ANXIETY SEVERITY
    // ---------------
    
    // Stress Frequency Anxiety Check
    if (responses.stressFrequency === "Always") {
      scores.anxietySeverity += 40;
      scores.wellbeingIndex -= 20;
    } else if (responses.stressFrequency === "Often") {
      scores.anxietySeverity += 30;
      scores.wellbeingIndex -= 15;
    } else if (responses.stressFrequency === "Sometimes") {
      scores.anxietySeverity += 20;
      scores.wellbeingIndex -= 10;
    } else if (responses.stressFrequency === "Rarely") {
      scores.anxietySeverity += 5;
      scores.wellbeingIndex -= 5;
    }
    
    // Emotional State Anxiety Check
    if (responses.emotionalState <= 5) {
      scores.anxietySeverity += 15;
    }
    
    // LIFESTYLE IMPACT
    // ---------------
    
    // Impact Assessment Check - already partially calculated above
    scores.lifestyleImpact += (responses.productivity_impact / 7) * 20;
    scores.lifestyleImpact += (responses.work_missed / 7) * 25;
    scores.lifestyleImpact += (responses.relationship_issues / 7) * 25;
    
    // COPING CAPACITY
    // --------------
    
    // Social Support Check
    if (responses.support === "Yes") {
      scores.copingCapacity += 20;
      scores.socialSupport += 40;
    } else if (responses.support === "Somewhat") {
      scores.copingCapacity += 10;
      scores.socialSupport += 20;
    } else if (responses.support === "No") {
      scores.copingCapacity -= 20;
      scores.socialSupport -= 40;
    }
    
    // Exercise Check
    if (responses.exerciseFrequency === "Regularly") {
      scores.copingCapacity += 20;
      scores.wellbeingIndex += 20;
    } else if (responses.exerciseFrequency === "Occasionally") {
      scores.copingCapacity += 10;
      scores.wellbeingIndex += 10;
    } else if (responses.exerciseFrequency === "Never") {
      scores.copingCapacity -= 10;
      scores.wellbeingIndex -= 10;
    }
    
    // Prior Therapy Check
    if (responses.priorTherapy === "Yes") {
      scores.copingCapacity += 15;
      scores.treatmentReadiness += 20;
    }
    
    // Relationship Status Check
    if (responses.relationshipStatus === "Married" || responses.relationshipStatus === "In a relationship") {
      scores.socialSupport += 15;
    } else if (responses.relationshipStatus === "Divorced" || responses.relationshipStatus === "Widowed") {
      scores.socialSupport -= 10; // Potential loss of support system
    }
    
    // TREATMENT READINESS
    // ------------------
    
    // Prior Therapy & Medication Check
    if (responses.priorTherapy === "Yes") {
      scores.treatmentReadiness += 20; // Already familiar with therapy process
    }
    
    if (responses.medication === "Yes") {
      scores.treatmentReadiness += 15; // Already engaged in treatment
    }
    
    // Past Diagnosis Check - string parsing required
    if (responses.pastDiagnosis && responses.pastDiagnosis.trim() !== "") {
      scores.treatmentReadiness += 25; // Has insight into mental health conditions
    }
    
    // Goals Check
    if (responses.goals && responses.goals.length > 0) {
      scores.treatmentReadiness += Math.min(responses.goals.length * 10, 30);
    }
    
    // Preferred Support Mode Check
    if (responses.preferredSupport === "Both") {
      scores.treatmentReadiness += 20; // High engagement with multiple modalities
    } else if (responses.preferredSupport === "Chat") {
      scores.treatmentReadiness += 15; // Active engagement
    } else if (responses.preferredSupport === "Self-help resources") {
      scores.treatmentReadiness += 10; // Self-directed engagement
    }
    
    // WELLBEING INDEX
    // --------------
    
    // Emotional State Wellbeing Check
    scores.wellbeingIndex += responses.emotionalState * 5;
    
    // Sleep Quality Check
    if (responses.sleepQuality === "Good") {
      scores.wellbeingIndex += 20;
    } else if (responses.sleepQuality === "Fair") {
      scores.wellbeingIndex += 10;
    }
    
    // Appetite Check
    if (responses.appetite === "Normal") {
      scores.wellbeingIndex += 15;
    }
    
    // Stress Check - already addressed in anxiety section
    
    // Ensure scores are within range
    for (const category in scores) {
      scores[category as keyof typeof scores] = Math.max(0, Math.min(100, scores[category as keyof typeof scores]));
    }
    
    return scores;
  }
  
  /**
   * Generate intervention recommendations based on scores
   */
  function generateInterventionPlan(scores:any, responses:any) {
    let interventionPlan = {
      interventionLevel: "",
      interventionLevelDetailedExplanation: "",
      recommendedApproaches: [] as string[][],
      contentPriorities: [] as string[][],
      safetyProtocol: "",
      sessionFrequency: "",
      resourceAllocation: [] as string[][]
    };
    
    // INTERVENTION LEVEL
    // -----------------
    if (scores.riskLevel >= 70) {
      interventionPlan.interventionLevel = "Crisis Intervention";
      interventionPlan.interventionLevelDetailedExplanation = "Based on your responses, we have identified a critical need for immediate crisis intervention. Our system has detected a high risk of self-harm or suicidal thoughts, and we strongly recommend that you seek immediate help from a mental health professional. Please call your local emergency services or the National Suicide Prevention Lifeline at +91-9152987821 in India, or contact a crisis center in your country, for immediate support."
      interventionPlan.safetyProtocol = "Immediate Crisis Response";
      interventionPlan.sessionFrequency = "Daily check-ins";
    } else if (scores.riskLevel >= 50) {
      interventionPlan.interventionLevel = "High Support";
      interventionPlan.interventionLevelDetailedExplanation = "Your assessment indicates a need for enhanced support. We recommend developing a personalized safety plan and engaging in multiple weekly sessions to address current challenges. Our team will work closely with you to stabilize symptoms and develop coping strategies."
      interventionPlan.safetyProtocol = "Safety Plan Creation";
      interventionPlan.sessionFrequency = "Multiple weekly sessions";
    } else if (scores.riskLevel >= 30 || scores.depressionSeverity >= 60 || scores.anxietySeverity >= 60) {
      interventionPlan.interventionLevel = "Moderate Support";
      interventionPlan.interventionLevelDetailedExplanation = "Your results suggest moderate symptoms that would benefit from proactive monitoring. Weekly sessions will help track progress and prevent escalation. We'll focus on skill-building and symptom management techniques."
      interventionPlan.safetyProtocol = "Risk Monitoring";
      interventionPlan.sessionFrequency = "Weekly sessions";
    } else {
      interventionPlan.interventionLevel = "Standard Support";
      interventionPlan.interventionLevelDetailedExplanation = "Your current assessment shows manageable symptoms. We recommend maintaining well-being through regular check-ins and preventive strategies. Our team is here to support your ongoing mental health journey."
      interventionPlan.safetyProtocol = "Standard Protocols";
      interventionPlan.sessionFrequency = "Weekly or bi-weekly sessions";
    }
    
    // RECOMMENDED APPROACHES
    // ---------------------
    
    // Depression-focused approaches
    if (scores.depressionSeverity >= 70) {
      interventionPlan.recommendedApproaches.push(["Depression-focused CBT","Depression-focused CBT is a type of therapy that helps you understand and change the thoughts and behaviors that contribute to depression."]);
      interventionPlan.recommendedApproaches.push(["Behavioral Activation","Behavioral Activation is an evidence-based approach that focuses on increasing engagement in meaningful activities to counteract depression's cycle of withdrawal and inactivity."]);
    } else if (scores.depressionSeverity >= 40) {
      interventionPlan.recommendedApproaches.push(["Mood Management Techniques","Practical strategies to identify mood patterns and develop healthier emotional regulation skills."]);
    }

    // Anxiety-focused approaches
    if (scores.anxietySeverity >= 70) {
      interventionPlan.recommendedApproaches.push(["Anxiety-focused CBT","Cognitive Behavioral Therapy techniques specifically tailored to challenge and modify anxiety-inducing thought patterns."]);
      interventionPlan.recommendedApproaches.push(["Exposure Therapy Principles","Gradual, controlled exposure to anxiety triggers to build resilience and reduce avoidance behaviors."]);
    } else if (scores.anxietySeverity >= 40) {
      interventionPlan.recommendedApproaches.push(["Anxiety Management Strategies","Immediate techniques for calming physiological symptoms of anxiety during stressful moments."]);
    }

    // Coping & Wellbeing approaches
    if (scores.copingCapacity < 50) {
      interventionPlan.recommendedApproaches.push(["Coping Skills Development","Building a personalized toolkit of healthy coping mechanisms for stress management."]);
    }

    if (scores.wellbeingIndex < 40) {
      interventionPlan.recommendedApproaches.push(["Wellbeing Enhancement","Strategies to improve life satisfaction through mindfulness and value-based living."]);
    }

    // Support network approaches
    if (scores.socialSupport < 50) {
      interventionPlan.recommendedApproaches.push(["Social Connection Building","Developing meaningful social connections and improving communication skills."]);
    }

    // Add general approaches based on user goals
    if (responses.goals) {
      if (responses.goals.includes("Feel happier")) {
        interventionPlan.recommendedApproaches.push(["Positive Psychology Techniques","Exercises to cultivate gratitude, optimism, and positive emotion regulation."]);
      }
      if (responses.goals.includes("Reduce stress")) {
        interventionPlan.recommendedApproaches.push(["Stress Management","Evidence-based techniques to identify and manage sources of chronic stress."]);
      }
      if (responses.goals.includes("Improve sleep")) {
        interventionPlan.recommendedApproaches.push(["Sleep Hygiene Protocol","Personalized recommendations for improving sleep quality and consistency."]);
      }
    }
    
    // CONTENT PRIORITIES
    // -----------------
    
    // Prioritize content based on scores
    const priorityAreas = [
      { area: "Depression Management", score: scores.depressionSeverity , detail:"Learn practical strategies to manage depressive symptoms and improve mood." },
      { area: "Anxiety Management", score: scores.anxietySeverity , detail:"Learn techniques to reduce anxiety and increase feelings of calm." },
      { area: "Daily Functioning", score: scores.lifestyleImpact , detail:"Improve daily functioning by identifying and challenging negative thought patterns." },
      { area: "Coping Skills", score: 100 - scores.copingCapacity , detail:"Develop a personalized coping skills toolkit to better manage stress." },
      { area: "Social Connection", score: 100 - scores.socialSupport , detail:"Build meaningful social connections and improve communication skills." },
      { area: "Wellbeing Practices", score: 100 - scores.wellbeingIndex , detail:"Develop healthy habits and routines to increase overall wellbeing." }
    ];
    
    // Sort by highest need (highest score)
    priorityAreas.sort((a, b) => b.score - a.score);
    
    // Take top 3 priority areas
    interventionPlan.contentPriorities = priorityAreas
      .slice(0, 3)
      .map(item => [item.area,item.detail]);
    
    // RESOURCE ALLOCATION
    // ------------------
    
    // Based on support mode preference
    if (responses.preferredSupport === "Chat" || responses.preferredSupport === "Both") {
      interventionPlan.resourceAllocation.push(["AI Chat Support","Use our AI chat Airoh to get immediate support and guidance."]);
    }
    
    if (responses.preferredSupport === "Self-help resources" || responses.preferredSupport === "Both") {
      interventionPlan.resourceAllocation.push(["Self-help Library Access","Use our self-help library to understand your mental health state and get guidance."]);
    }
    
    // Based on specific needs
    if (scores.wellbeingIndex < 50 && responses.exerciseFrequency !== "Regularly") {
      interventionPlan.resourceAllocation.push(["Exercise Program Access","Use our exercise program to understand your physical health state and get guidance."]);
    }
    
    if (responses.sleepQuality === "Poor" || responses.goals.includes("Improve sleep")) {
      interventionPlan.resourceAllocation.push(["Sleep Resources","Use our sleep resources to understand your sleep patterns and get guidance."]);
    }
    
    if (scores.riskLevel >= 30) {
      interventionPlan.resourceAllocation.push(["Crisis Resources","Use our crisis resources to understand your risk level and get guidance."]);
    }
    
    return interventionPlan;
  }
  
  /**
   * Complete assessment process
   */
  export function processUserOnboarding(responses:any) {
    // Calculate scores across assessment dimensions
    const scores = calculateTherapyScores(responses);
    
    // Generate intervention recommendations
    const interventionPlan = generateInterventionPlan(scores, responses);
    
    return {
      scores,
      interventionPlan,
      goals: responses.goals,
      userProfile: {
        age: responses.age,
        gender: responses.gender,
        goals: responses.goals,
        occupation: responses.occupation,
        relationshipStatus: responses.relationshipStatus,
        hasTherapyHistory: responses.priorTherapy === "Yes",
        onMedication: responses.medication === "Yes",
        hasDiagnosis: responses.pastDiagnosis && responses.pastDiagnosis.trim() !== "",
        preferredSupportMode: responses.preferredSupport
      }
    };
  }
  
  /**
   * Example usage with sample user responses
   */
  const sampleResponses = {
    // Demographics
    age: 34,
    gender: "Female",
    occupation: "Teacher",
    relationshipStatus: "Married",
    
    // Presenting Concerns
    emotionalState: 4, // Scale 1-10
    stressFrequency: "Often",
    
    // Mental Health History
    priorTherapy: "Yes",
    medication: "No",
    pastDiagnosis: "Generalized Anxiety Disorder",
    
    // Wellbeing & Lifestyle
    sleepQuality: "Poor",
    appetite: "Decreased",
    support: "Somewhat",
    exerciseFrequency: "Occasionally",
    
    // Goals & Preferences
    goals: ["Reduce stress", "Improve sleep", "Feel happier"],
    preferredSupport: "Both",
    
    // Safety Screening
    selfHarm: "No",
    crisisHelp: "No",
    
    // Impact Assessment
    productivity_impact: 4,
    work_missed: 1,
    relationship_issues: 3,
    
    // Mood Frequency
    feeling_down: "More than half"
  };
  
  // For demonstration, show results for the sample user
  const assessmentResults = processUserOnboarding(sampleResponses);
  console.log(JSON.stringify(assessmentResults, null, 2));