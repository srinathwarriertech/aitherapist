"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const mockResults = {
  personalGoals: [
    { title: 'Happiness', description: '“Happiness comes from within” is only partially true. Everyone needs outside help.' }
  ],
  mainFocus: [
    { title: 'Depressive Symptoms', level: 'Low / Medium level', description: 'You may be experiencing Low / Medium levels of Depressive Symptoms' },
    { title: 'Anxiety Symptoms', level: 'Normal level', description: 'You likely do not have elevated Anxiety Symptoms' }
  ]
};

import { useUser } from '@clerk/nextjs';

const ResultsPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

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
        {/* <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Personal goals</h2>
          <p className="mb-4 text-gray-600">Your goals help us personalize your experience.</p>
          <div className="bg-gray-50 rounded-lg shadow p-4 mb-4">
            <div className="font-medium text-[#5940A8]">{mockResults.personalGoals[0].title}</div>
            <div className="text-gray-700 text-sm">{mockResults.personalGoals[0].description}</div>
          </div>
        </section> */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Main focus</h2>
          <p className="mb-4 text-gray-600 text-sm">These results are screenings only and NOT a diagnosis. They are intended to help guide you and your care team in your care.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockResults.mainFocus.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border">
                <div className="font-medium text-[#7B64C0]">{item.title}</div>
                <div className="text-gray-700 text-sm">{item.level}</div>
                <div className="text-gray-500 text-xs">{item.description}</div>
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
