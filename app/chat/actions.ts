"use server";
import Groq from "groq-sdk";
import { ChatGroq } from '@langchain/groq';
import { AIMessageChunk } from '@langchain/core/messages';
import { concat } from '@langchain/core/utils/stream';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { queryKnowledge } from '@/app/lib/embeddings'

const mygroq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});



const llm = new ChatGroq({
    // model: "mixtral-8x7b-32768",
    model :"deepseek-r1-distill-llama-70b",
    temperature: 0,
    apiKey: process.env.GROQ_API_KEY 
    // other params...
  });

const model = groq('gemma2-9b-it');

// Define the Message type
export type Message = {
    role: "system" | "user" | "assistant";
    content: string;
  };


  
  
// Function to get the chatbot response
export async function getGroqChatCompletion(messages: Message[]) {
    // const groq = new Groq({ apiKey: process.env.GROQ_KEY ,dangerouslyAllowBrowser: true});
    // return groq.chat.completions.create({
    //   messages,
    //   model: "llama3-8b-8192",
    // });
    // console.log("start");
    const input = `Translate "I love programming" into French.`;

    // Models also accept a list of chat messages or a formatted prompt
    // return llm.invoke(input);
    // return result;

    const stream = await llm.stream(messages[messages.length-1].content);
    let full: AIMessageChunk | undefined;
    for await (const chunk of stream) {
      full = !full ? chunk : concat(full, chunk);
    }
    console.log(full);
    return full?.content;
}


export async function getGroqResponse(messages: Message[]) {
  const lastMessage = messages[messages.length - 1].content
  const knowledge = await queryKnowledge(lastMessage)

  const { text } = await generateText({
    model: mygroq('deepseek-r1-distill-llama-70b'),
    messages: [
      ...messages,
      {
        role: "system",
        content: `Answer using ONLY this knowledge base:
        ${knowledge}
        
        If no relevant information exists, say "I need to consult my knowledge base to answer that properly."
        
        After your main response, provide 3 short suggested replies the user might want to say next, as a JSON object with 'response' (your main reply) and 'suggestions' (an array of 3 strings). Example: {"response": "Here is your answer.", "suggestions": ["Yes, tell me more.", "No, I have another question.", "Can you explain differently?"]}`
      }
    ]
  });
  
  return text;
}
