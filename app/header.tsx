// Import necessary modules
import Link from 'next/link';
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'

// Define the Header component
export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 sticky top-0 z-50">
      {/* Header container */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Website title */}
        <h1 className="text-xl font-semibold">
            <a href="/">
              Airoh
            </a>
        </h1>
        {/* Navigation menu */}
        {/* <nav className="hidden md:block">
          <ul className="flex gap-x-6">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
          </ul>
        </nav> */}


        <ClerkProvider>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
        </ClerkProvider>
        
      </div>
    </header>
  );
}

