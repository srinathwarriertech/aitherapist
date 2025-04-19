"use client"
import React, { useState } from "react";
import {Message, getGroqChatCompletion, getGroqResponse} from "./actions"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Paper, TextField, Button, Container, CssBaseline } from '@mui/material';
import axios from "axios"; // Add axios for API calls
import { useChat } from 'ai/react';

// import { Pinecone } from '@pinecone-database/pinecone';


const theme = createTheme({
  palette: {
    primary: {
      main: '#5940A8',
      light: '#7B64C0',
      dark: '#432D8B',
    },
    secondary: {
      main: '#CCC6DD',
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '10px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
  },
});

export default function Chatbot() {
  // State to store user input and conversation history
  const [userInput, setUserInput] = useState("");
  const [defaultMessages, setMessages] = useState<Message[]>([
    {
      role: "system",
      //content: "You are a compassionate and helpful mental health expert called Maya in the app NeuroLiving by Dr. Sid Warrier, India's top neuroscientist, providing users with emotional support and practical advice."+
      //       "Your answers are warm, but with a deep knowledge of Neuroscience."+
      //        "You set the context, but only ask one question back to user at a time.",
      content:"You are Maya, an AI therapist designed to provide compassionate and personalized mental health support. "+
        "Before starting the conversation, here is the user's onboarding information: "+
        //"- Age: 29 "+
        "- Gender: Female "+
        "- Location: Mumbai, India "+
        "- Occupation: Software Engineer "+
        " Onboarding Questionnaire Summary: "+
        "- Main concern: Managing work-life balance. "+
        "- Stress triggers: Deadlines and lack of sleep. "+
        "- Current coping strategies: Yoga and journaling. "+
        "- Therapy goals: Improve focus and reduce anxiety. "+
        "Your goal is to create a safe and supportive space for the user. Start the conversation slowly, asking one question at a time to encourage thoughtful and detailed responses. Avoid overwhelming the user with too many questions at once."+
        "Begin by introducing yourself and asking a simple, open-ended question like: 'How are you feeling today?' Use the user's onboarding information to guide the conversation naturally, addressing their specific concerns and goals over time. Respond empathetically, and wait for the user's input before asking follow-up questions."
        // "Use this information to understand the user's background and tailor your responses accordingly. "+
        // "Be empathetic, supportive, and insightful. "+
        // "Always prioritize the user's mental wellbeing and adapt your guidance to their specific needs. "+
        // "Dont give long answers asking for too much information at once, break them down."+
        // "Now, start the conversation by introducing yourself and asking how you can help today."
    },
  ]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({});

  
  // Function to handle sending user message and receiving chatbot response
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: "user", content: userInput };

    // Update conversation with the user's message
    const updatedMessages: Message[] = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput(""); // Clear input field

    try {
      // Get chatbot response
      //const chatCompletion = await getGroqChatCompletion(updatedMessages);
      const chatCompletion = await getGroqResponse(updatedMessages);
      const botMessage: Message = {
        role: "assistant",
        //content: chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.",
        content: JSON.stringify(chatCompletion)+"" || "Sorry, I couldn't process that.",
      };

      // Update conversation with bot response
      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([...updatedMessages, { role: "assistant", content: "Something went wrong. Please try again later." }]);
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      console.log('Input value', e.target.value);
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
