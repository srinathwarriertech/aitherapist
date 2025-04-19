import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

// Import the Header and Footer components
import Header from './header';

//Load shadcn sidebar and then uncomment this for Sidebar
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mental Wellbeing App',
  description: 'A mental wellbeing app for companies and their employees',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SignedOut>
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
              <h1 className="text-4xl font-bold mb-8 text-primary">Welcome to NeuroLiving</h1>
              <SignInButton />
            </div>
          </SignedOut>


          <SignedIn>
            
            <Header />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            {children}
            </ThemeProvider>

            {/* <SidebarProvider>
              <AppSidebar />
              <main>
                <SidebarTrigger />
                    <UserButton /> 
                    {children}                   
                </main>
            </SidebarProvider> */}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}