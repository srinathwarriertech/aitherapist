import Groq from "groq-sdk";
import { ChatGroq } from '@langchain/groq';
import { AIMessageChunk } from '@langchain/core/messages';
import { concat } from '@langchain/core/utils/stream';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const mygroq = createGroq({
  // custom settings
  // model: "mixtral-8x7b-32768",
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_KEY
  // temperature: 0,
  // apiKey: process.env.GROQ_KEY 
});



const llm = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
    apiKey: process.env.GROQ_KEY 
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
  const { text } = await generateText({
    model: mygroq('mixtral-8x7b-32768'),
    // prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    messages: messages
  });
  return text;
}