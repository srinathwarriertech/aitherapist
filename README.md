# AI Therapist

An innovative AI-powered therapy platform designed to provide accessible mental health support and guidance.

## Description

AI Therapist is a web-based application that leverages artificial intelligence to provide supportive conversations and mental health resources to users. The platform offers a safe, confidential space for users to discuss their thoughts and feelings while receiving empathetic responses and practical guidance.

## Features

- 🤖 AI-powered conversational therapy
- 🔒 Secure and confidential interactions
- 📱 Responsive design for all devices
- 💡 Evidence-based therapeutic approaches
- 📊 Progress tracking and mood monitoring

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aitherapist.git
cd aitherapist
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add necessary configuration:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GROQ_API_KEY=
```

- You can get the first 2 keys from a Supabase dashboard. Make sure to create a table called OnboardingFormResponses
- You only need Clerk key if you want to manage the login yourself 
- You can get a GROQ key from the Groq console. This gives you access to LLMs like Deepseek for free. 

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Create an account or log in
2. Start a new therapy session
3. Engage in conversation with the AI therapist
4. Access resources and track your progress (In progress)

## Technology Stack

- Frontend: Next.js, React, TypeScript
- Styling: Tailwind CSS
- AI Integration: Deepseek
- Authentication: Clerk

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - Srinath Warrier srinathwarriertech@gmail.com

Project Link: [https://github.com/srinathwarriertech/aitherapist](https://github.com/srinathwarriertech/aitherapist)

## Acknowledgments

- Groq and Deepseek for providing the AI capabilities
- The mental health professional community for guidance