"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

import { processOnboardingResponses, ResultSection } from '../onboarding/onboardingAlgorithm';

import { useUser } from '@clerk/nextjs';

const ResultsPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Read onboarding data from sessionStorage (client-side only)
  const [sections, setSections] = React.useState<ResultSection[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('onboardingData');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          const resultSections = processOnboardingResponses(parsed);
          setSections(resultSections);
        } catch (e) {
          setSections([]);
        }
      }
    }
  }, []);

  const handleDownload = () => {
    // Placeholder for PDF download logic
    alert('Download as PDF coming soon!');
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
          <p className="mb-4 text-gray-600 text-sm">These results are screenings only and NOT a diagnosis. They are intended to help guide you and your care team in your care.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.length === 0 && (
              <div className="text-gray-500">No results found. Please complete the onboarding form.</div>
            )}
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border">
                <div className="font-medium text-[#7B64C0]">{section.title}</div>
                <div className="text-gray-500 text-xs mt-2">{section.description}</div>
              </div>
            ))}
          </div>
        </section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          <button onClick={handleDownload} className="bg-white border border-[#5940A8] text-[#7B64C0] px-4 py-2 rounded shadow hover:bg-[#CCC6DD]">Download results</button>
          <button onClick={handleSeePlan} className="bg-[#5940A8] text-white px-6 py-3 rounded shadow hover:bg-[#432D8B] font-semibold">See my personalized care plan</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
