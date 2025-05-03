"use client";
import React from 'react';
import Link from 'next/link';

import { useUser } from '@clerk/nextjs';

const HomePage = () => {
  const { user, isLoaded } = useUser();
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {isLoaded && user ? (
  <h1 className="text-4xl font-normal mb-12 text-[#5940A8]">Hi {user.firstName}, Welcome to Your Care Plan</h1>
) : (
  <h1 className="text-4xl font-normal mb-12 text-[#5940A8]">Welcome to Your Care Plan</h1>
)}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {/* Therapists Card */}
        <TherapistCard />
        {/* Medication Manager Card */}
        <MedicationCard />
        {/* AIroh Card */}
        <ChatCard />
      </div>
    </div>
  );
};

// Therapist Card Component
import { useState } from 'react';

function TherapistCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-h-[320px] h-full flex-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? '/gifs/therapist.gif' : '/therapist.png'}
        alt="Therapist Icon"
        className="mb-4 h-24 w-24 object-contain rounded-xl shadow"
      />
      <h2 className="text-lg mb-2 text-[#5940A8] text-center">Browse Therapists</h2>
      <p className="text-gray-600 text-base mb-6 text-center">Find the right therapist for you from our network.</p>
      <Link href="#">
        <button className="w-full px-6 py-2 rounded-lg bg-[#CCC6DD] text-[#5940A8] font-normal hover:bg-[#b3aad1] focus:outline-none focus:ring-2 focus:ring-[#7B64C0] transition">Browse therapists</button>
      </Link>
    </div>
  );
}

// Medication Card Component
function MedicationCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-h-[320px] h-full flex-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? '/gifs/medication.gif' : '/medication.png'}
        alt="Medication Icon"
        className="mb-4 h-24 w-24 object-contain rounded-xl shadow"
      />
      <h2 className="text-lg mb-2 text-[#5940A8] text-center">Find a Medication Manager</h2>
      <p className="text-gray-600 text-base mb-6 text-center">Get matched with a medication management specialist.</p>
      <Link href="#">
        <button className="w-full px-6 py-2 rounded-lg bg-[#CCC6DD] text-[#5940A8] font-normal hover:bg-[#b3aad1] focus:outline-none focus:ring-2 focus:ring-[#7B64C0] transition">Find a manager</button>
      </Link>
    </div>
  );
}

// Chat Card Component
function ChatCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-h-[320px] h-full flex-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? '/gifs/chat2.gif' : '/chat2.jpg'}
        alt="AIroh Icon"
        className="mb-4 h-24 w-24 object-contain rounded-xl shadow"
      />
      <h2 className="text-lg mb-2 text-[#5940A8] text-center">Talk to Airoh</h2>
      <p className="text-gray-600 text-base mb-6 text-center">Chat with our AI therapist - trained with your data.</p>
      <Link href="/chat">
        <button className="w-full px-6 py-2 rounded-lg bg-[#CCC6DD] text-[#5940A8] font-normal hover:bg-[#b3aad1] focus:outline-none focus:ring-2 focus:ring-[#7B64C0] transition">Talk to Airoh</button>
      </Link>
    </div>
  );
}

export default HomePage;

