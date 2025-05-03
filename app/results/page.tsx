"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

// import { processOnboardingResponses, ResultSection } from '../onboarding/onboardingAlgorithm';
import { goalsOptions } from '../onboarding/fields';

import { useUser } from '@clerk/nextjs';
import { jsPDF } from 'jspdf';

const goalActionDescriptions: Record<string, string> = {
  feel_happier: "Focus on small moments of joy each day—whether it's a walk, a favorite song, or connecting with a friend. Small positive actions can lift your mood over time.",
  regain_interest: "Try setting aside a small amount of time each week to revisit an old hobby or activity you once loved. Start with something simple, and notice how it makes you feel.",
  feel_relaxed: "Practice deep breathing or short mindfulness breaks throughout your day. Taking a few minutes to pause can help you regain a sense of calm and control.",
  improve_sleep: "Establish a calming bedtime routine and aim to go to bed at the same time each night. Small changes can make a big difference.",
  reduce_alcohol: "Consider tracking your drinking habits and setting small, achievable goals. Reaching out for support can also make the journey easier.",
  reduce_smoking: "Try gradually reducing your intake or replacing smoking breaks with a healthy habit. Support groups or helplines can also help you stay on track.",
  reduce_drugs: "You're not alone—support is available. Consider reaching out to a professional or a trusted person for help, and take one step at a time.",
};

const ResultsPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Read onboarding results from sessionStorage (client-side only)
  const [results, setResults] = React.useState<{ scores: any; interventionPlan: any; userProfile: any } | null>(null);

  console.log("results:",results)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const resultsData = sessionStorage.getItem('onboardingResults');
      if (resultsData) {
        try {
          setResults(JSON.parse(resultsData));
        } catch (e) {
          setResults(null);
        }
      }
    }
  }, []);

  const handleDownload = () => {
    if (!results) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor('#5940A8');
    doc.text('Your Personalized Report', pageWidth / 2, y, { align: 'center' });
    y += 30;
    doc.setDrawColor('#CCC6DD');
    doc.setLineWidth(1);
    doc.line(40, y, pageWidth - 40, y); // divider
    y += 20;

    // Optional: User name
    if (user && user.firstName) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor('#333');
      doc.text(`Name: ${user.firstName}`, 50, y);
      y += 24;
    }

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor('#888');
    doc.text('Note: These results are screenings only and NOT a diagnosis. They are intended to help guide you and your care team in your care.', 50, y, { maxWidth: pageWidth - 100 });
    y += 30;

    // Goal cards
    results.userProfile.goals.forEach((goal: string, idx: number) => {
      if (y > 700) {
        doc.addPage();
        y = 40;
      }
      // Card box
      doc.setDrawColor('#7B64C0');
      doc.setFillColor('#F4F1FA');
      doc.roundedRect(40, y, pageWidth - 80, 80, 8, 8, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor('#7B64C0');
      doc.text(goal, 55, y + 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor('#333');
      const description = goalActionDescriptions[goal] || goal;
      const lines = doc.splitTextToSize(description, pageWidth - 110);
      doc.text(lines, 55, y + 44);
      y += 100;
    });

    // Scores
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor('#7B64C0');
    doc.text('Assessment Scores', 50, y);
    y += 24;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#333');
    Object.entries(results.scores || {}).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 60, y);
      y += 18;
    });
    y += 10;

    // Intervention Plan
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor('#7B64C0');
    doc.text('Intervention Plan', 50, y);
    y += 24;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#333');
    if (results.interventionPlan) {
      if (results.interventionPlan.contentPriorities) {
        doc.text('Top Priorities:', 60, y);
        y += 18;
        results.interventionPlan.contentPriorities.forEach((priority: string) => {
          doc.text(`- ${priority}`, 70, y);
          y += 16;
        });
        y += 10;
      }
      if (results.interventionPlan.resourceAllocation) {
        doc.text('Resource Allocation:', 60, y);
        y += 18;
        results.interventionPlan.resourceAllocation.forEach((resource: [string, string]) => {
          doc.text(`- ${resource[0]}: ${resource[1]}`, 70, y);
          y += 16;
        });
        y += 10;
      }
    }

    // // User Profile
    // doc.setFont('helvetica', 'bold');
    // doc.setFontSize(18);
    // doc.setTextColor('#7B64C0');
    // doc.text('User Profile', 50, y);
    // y += 24;
    // doc.setFont('helvetica', 'normal');
    // doc.setFontSize(12);
    // doc.setTextColor('#333');
    // Object.entries(results.userProfile || {}).forEach(([key, value]) => {
    //   doc.text(`${key}: ${value}`, 60, y);
    //   y += 18;
    // });
    // y += 10;

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor('#AAA');
    doc.text('Generated by Airoh', pageWidth - 50, 820, { align: 'right' });

    doc.save('Personalized Report.pdf');
  };

  const handleSeePlan = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 relative">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        {isLoaded && user ? (
          <h1 className="text-3xl font-normal mb-8 text-[#5940A8]">Hi {user.firstName}, Your results ↓</h1>
        ) : (
          <h1 className="text-3xl font-normal mb-8 text-[#5940A8]">Your results ↓</h1>
        )}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Your Personalized Report</h2>
          <p className="mb-4 text-gray-600 text-sm">Note: These results are screenings only and NOT a diagnosis. They are intended to help guide you and your care team in your care.</p>
          {!results && (
            <div className="text-gray-500">No results found. Please complete the onboarding form.</div>
          )}
          {results && (
            <div className="space-y-6">
              {/* Goals Cards */}
              <h2 className="text-xl font-semibold mb-2">Goals</h2>
              {results.userProfile.goals.map((goal: string, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-4 border">
                  <div className="font-medium text-[#7B64C0] mb-2">
                    {goalsOptions.find((g) => g.id === goal)?.label}
                  </div>
                  <ul className="text-gray-700 text-sm">                    
                      <li key={idx}>
                        {goalActionDescriptions[goal]}
                      </li>
                  </ul>
                </div>
              ))}
              {/* Scores Card */}
              {/* <h2 className="text-xl font-semibold mb-2">Assessment Scores</h2>
              {Object.entries(results.scores || {}).map(([key, value]) => (
                <div className="bg-white rounded-lg p-4 border">
                  <div className="font-medium text-[#7B64C0] mb-2">
                    <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </div>  
                  <ul className="text-gray-700 text-sm">
                      <li key={key}>
                        Your <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span> score is {value}.
                      </li>
                  </ul>
                </div>
              ))} */}
              {/* Intervention Plan Card */}
              <h2 className="text-xl font-semibold mb-2">Intervention Plan</h2>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-medium text-[#7B64C0] mb-2">Top Priorities:</div>
                {results.interventionPlan && (
                  <>
                    {results.interventionPlan.contentPriorities && (
                      <div className="mb-2">
                        <ul className="list-disc pl-5">
                          {results.interventionPlan.contentPriorities.map((priority: string[], idx: number) => (
                            <li key={idx}>{priority[0]} - {priority[1]}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-medium text-[#7B64C0] mb-2">Recommended Approaches:</div>
                {results.interventionPlan && (
                  <>
                    {results.interventionPlan.recommendedApproaches && (
                      <div>
                        <ul className="list-disc pl-5">
                          {results.interventionPlan.recommendedApproaches.map((approach: [string, string], idx: number) => (
                            <li key={idx}><span className="font-semibold">{approach[0]}:</span> {approach[1]}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-medium text-[#7B64C0] mb-2">Resource Allocation:</div>
                {results.interventionPlan && (
                  <>
                    {results.interventionPlan.resourceAllocation && (
                      <div>
                        <ul className="list-disc pl-5">
                          {results.interventionPlan.resourceAllocation.map((resource: [string, string], idx: number) => (
                            <li key={idx}><span className="font-semibold">{resource[0]}:</span> {resource[1]}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              
            </div>
          )}
        </section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          <button onClick={handleDownload} className="bg-white border border-[#5940A8] text-[#7B64C0] px-4 py-2 rounded shadow hover:bg-[#CCC6DD]">Download results ↓</button>
          <button onClick={handleSeePlan} className="bg-[#5940A8] text-white px-6 py-3 rounded shadow hover:bg-[#432D8B] font-semibold">See my personalized care plan →</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
