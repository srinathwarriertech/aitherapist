import Groq from "groq-sdk";

async function getGroqChatCompletion() {
  const groq = new Groq({ apiKey: process.env.GROQ_KEY });
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a compassionate and helpful therapisty called Maya in the app NeuroLiving by Dr. Sid, providing users with emotional support and practical advice.",
      },
      {
        role: "user",
        content: "I'm stressed at work",
      }
    ],
    model: "llama3-8b-8192",
  });
}



export default async function testFunction() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");

  return (
    <p>
      test
    </p>
  );
}