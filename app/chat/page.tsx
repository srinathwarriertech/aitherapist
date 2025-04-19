"use client"
import React, { useState, useRef, useEffect } from "react";
import {Message, getGroqChatCompletion, getGroqResponse} from "./actions"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Paper, TextField, Button, Container, CssBaseline } from '@mui/material';
import axios from "axios"; // Add axios for API calls
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

function getPrompt(){
  const prompt0 = ""+
        "You are Maya, an AI therapist designed to provide compassionate and personalized mental health support. "+
        "Give 1 line answers , not asking for too much information at once, break them down."+
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
       
        // "Now, start the conversation by introducing yourself and asking how you can help today."

  const prompt = "You are Maya, an AI therapist designed to support users with mental health. "+
    "Give 1 line answers , not asking for too much information at once, break them down."+


    "Your key functionalities are:"
    "Help User Calm Down: Guide users through breathing exercises or mindfulness techniques to calm them when they feel stressed or overwhelmed."+
    "Journal: Encourage users to express their feelings and thoughts through journaling. Provide prompts to help them start and support them in reflecting on their emotions."+
    "Rant: Let users express their frustrations freely. Offer a safe, non-judgmental space for them to vent about anything on their mind."+
    "Mental Health from a Neuroscience Perspective: Provide insights about the brain and how emotions, stress, and mental health issues affect the body and mind, from a neuroscience perspective."+
    "You should be empathetic, concise, and clear in your responses. Always ensure to ask the user if they have followed the instructions before proceeding to the next step. "+
    "If they do not understand or need clarification, explain in simple terms. "+
    "Your tone is calm, supportive, and non-judgmental. Always encourage users to take care of their mental health."
  return prompt0;
};

export default function Chatbot() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // State to store user input and conversation history
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      //content: "You are a compassionate and helpful mental health expert called Maya in the app NeuroLiving by Dr. Sid Warrier, India's top neuroscientist, providing users with emotional support and practical advice."+
      //       "Your answers are warm, but with a deep knowledge of Neuroscience."+
      //        "You set the context, but only ask one question back to user at a time.",
      content:getPrompt()
    },
  ]);
  
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
      let chatCompletion = await getGroqResponse(updatedMessages);
      if(chatCompletion.startsWith("<think>")){
        chatCompletion = chatCompletion.split("</think>\n\n")[1];
      }
      const botMessage: Message = {
        role: "assistant",
        //content: chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.",
        content: chatCompletion+"" || "Sorry, I couldn't process that.",
      };
      console.log("Response value:"+chatCompletion);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: '24px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            pb: 2
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              Maya - by NeuroLiving
            </Typography>
          </Box>

          {/* Chat Window */}
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            mb: 3,
            p: 2,
            borderRadius: '16px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#CCC6DD',
              borderRadius: '4px',
              '&:hover': {
                background: '#5940A8',
              },
            },
          }}>
            {messages.slice(1).map((message, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                  opacity: 1,
                  transform: 'translateY(0)',
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(10px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.role === 'user' ? 'primary.main' : '#fff',
                    borderRadius: message.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    boxShadow: message.role === 'user' 
                      ? '0 2px 12px rgba(89, 64, 168, 0.2)'
                      : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: message.role === 'user' 
                        ? '0 4px 16px rgba(89, 64, 168, 0.3)'
                        : '0 4px 16px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: message.role === 'user' ? '#fff' : '#333',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      whiteSpace: "pre-line"
                    }}
                  >
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              p: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={onKeyPress}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#fff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                      '& fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  },
                }}
              />
              <Button
                disableElevation
                variant="contained"
                onClick={handleSendMessage}
                sx={{
                  minWidth: '120px',
                  background: '#5940A8 !important',
                  color: '#ffffff',
                  '&:hover': {
                    background: '#432D8B !important',
                  },
                  '&:disabled': {
                    background: '#7B64C0 !important',
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                Send
              </Button>
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                textAlign: 'center',
                fontSize: '0.75rem',
              }}
            >
              AI can make mistakes. Check important info.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
