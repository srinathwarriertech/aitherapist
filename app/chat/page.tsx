"use client"
import React, { useState, useRef, useEffect } from "react";
import {Message, getGroqChatCompletion, getGroqResponse} from "./actions"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Paper, TextField, Button, Container, CssBaseline } from '@mui/material';
import ElephantAvatar from '../../components/ui/ElephantAvatar';
import axios from "axios"; // Add axios for API calls
// import { Pinecone } from '@pinecone-database/pinecone';
import { promptData } from "@/app/chat/knowledge";


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
  // Retrieve onboarding data from sessionStorage
  const onboardingData = typeof window !== 'undefined' 
    ? sessionStorage.getItem('onboardingData')
    : null;
  const userData = onboardingData ? JSON.parse(onboardingData) : {};

  

  const prompt0 = `You are Airoh, an AI therapist designed to provide compassionate and personalized mental health support.
    Give 1 line answers, not asking for too much information at once, break them down.
    Before starting the conversation, here is the user's onboarding information:
    - Goals: ${userData.goals?.join(', ') || 'Not specified'}
    - Productivity Impact: ${userData.productivity_impact || 0} days
    - Work Missed: ${userData.work_missed || 0} days
    - Relationship Issues: ${userData.relationship_issues || 0} days
    - Feeling Down Frequency: ${userData.feeling_down || 'Not specified'}

    Neuroscience information:
    `+
    promptData+
    `
    Note:
    Your goal is to create a safe and supportive space for the user. Start the conversation slowly, 
    asking one question at a time to encourage thoughtful and detailed responses.`;

  // const prompt = "You are Airoh, an AI therapist designed to support users with mental health. "+
  //   "Give 1 line answers , not asking for too much information at once, break them down."+


  //   "Your key functionalities are:"
  //   "Help User Calm Down: Guide users through breathing exercises or mindfulness techniques to calm them when they feel stressed or overwhelmed."+
  //   "Journal: Encourage users to express their feelings and thoughts through journaling. Provide prompts to help them start and support them in reflecting on their emotions."+
  //   "Rant: Let users express their frustrations freely. Offer a safe, non-judgmental space for them to vent about anything on their mind."+
  //   "Mental Health from a Neuroscience Perspective: Provide insights about the brain and how emotions, stress, and mental health issues affect the body and mind, from a neuroscience perspective."+
  //   "You should be empathetic, concise, and clear in your responses. Always ensure to ask the user if they have followed the instructions before proceeding to the next step. "+
  //   "If they do not understand or need clarification, explain in simple terms. "+
  //   "Your tone is calm, supportive, and non-judgmental. Always encourage users to take care of their mental health."

    // const prompt2=      //content: "You are a compassionate and helpful mental health expert called Maya in the app NeuroLiving by Dr. Sid Warrier, India's top neuroscientist, providing users with emotional support and practical advice."+
    //       "Your answers are warm, but with a deep knowledge of Neuroscience."+
    //        "You set the context, but only ask one question back to user at a time.",

  return prompt0;
};

export default function Chatbot() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // State to store user input and conversation history
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:getPrompt()
    },
  ]);
  // State for quick replies (suggestions)
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  // Loading state for typing animation
  const [loading, setLoading] = useState(false);
  
  // Function to handle sending user message and receiving chatbot response
  const handleSendMessage = async (inputOverride?: string) => {
    const input = typeof inputOverride === 'string' ? inputOverride : userInput;
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };

    // Update conversation with the user's message
    const updatedMessages: Message[] = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput(""); // Clear input field
    setQuickReplies([]); // Clear quick replies while waiting for response
    setLoading(true); // Show typing animation

    try {
      // Get chatbot response
      let chatCompletion = await getGroqResponse(updatedMessages);
      if(chatCompletion.startsWith("<think>")){
        chatCompletion = chatCompletion.split("</think>\n\n")[1];
      }
      let responseText = chatCompletion;
      let suggestions: string[] = [];
      // Try to extract and parse JSON from markdown code block, inline JSON, or raw JSON
      try {
        // Try code block first
        const match = chatCompletion.match(/```json\s*([\s\S]*?)```/i) || chatCompletion.match(/```\s*([\s\S]*?)```/i);
        let jsonString = '';
        if (match) {
          jsonString = match[1].trim();
        } else {
          // Try to extract a JSON object anywhere in the string
          const objMatch = chatCompletion.match(/{[\s\S]*?}/);
          if (objMatch) {
            jsonString = objMatch[0];
          }
        }
        if (jsonString) {
          const parsed = JSON.parse(jsonString);
          if (parsed.response && Array.isArray(parsed.suggestions)) {
            responseText = parsed.response;
            suggestions = parsed.suggestions;
          }
        }
      } catch (e) {
        // fallback: treat as plain text
      }
      const botMessage: Message = {
        role: "assistant",
        content: responseText || "Sorry, I couldn't process that.",
      };
      setMessages([...updatedMessages, botMessage]);
      setQuickReplies(suggestions);
      setLoading(false); // Hide typing animation
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([...updatedMessages, { role: "assistant", content: "Something went wrong. Please try again later." }]);
      setQuickReplies([]);
      setLoading(false); // Hide typing animation
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
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
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
            height: 'calc(100vh - 32px)',
            maxHeight: 'calc(100vh - 32px)',
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
              Talk to Airoh
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
              <React.Fragment key={index}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
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
                  {message.role === 'assistant' && (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'flex-end' }}>
                      {/* <ElephantAvatar size={40} /> */}
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow">
                        <img src="/elephant-icon.png" className="h-10 w-10 object-cover" />
                      </div>
                    </Box>
                  )}
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
                {/* Quick Replies: show only after the latest assistant message */}
                {index === messages.slice(1).length - 1 && messages[messages.length - 1].role === 'assistant' && quickReplies.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, ml: 6 }}>
                    {quickReplies.map((reply, idx) => (
  <Button
    key={idx}
    variant="outlined"
    color="primary"
    size="small"
    sx={{
      borderRadius: '20px',
      textTransform: 'none',
      fontWeight: 500,
      borderColor: '#5940A8',
      color: '#5940A8',
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: '#f5f0ff',
        borderColor: '#432D8B',
        color: '#432D8B'
      }
    }}
    onClick={() => handleSendMessage(reply)}
  >
    {reply}
  </Button>
))}
                  </Box>
                )}
              </React.Fragment>
            ))}
            {/* Typing animation while waiting for response */}
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow">
                    <img src="/elephant-icon.png" className="h-10 w-10 object-cover" />
                  </div>
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: '#fff',
                    borderRadius: '20px 20px 20px 5px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ display: 'inline-block', minWidth: 40 }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                </Paper>
                <style>{`
                  .typing-dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    margin: 0 2px;
                    background: #5940A8;
                    border-radius: 50%;
                    opacity: 0.6;
                    animation: typing-bounce 1.2s infinite both;
                  }
                  .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                  }
                  .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                  }
                  @keyframes typing-bounce {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.6; }
                    40% { transform: scale(1.2); opacity: 1; }
                  }
                `}</style>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              p: { xs: 1, sm: 2 },  // Reduced padding on mobile
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },  // Reduced gap on mobile
              flexDirection: { xs: 'column', sm: 'row' }  // Stack on mobile, row on tablet/desktop
            }}>
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
                    minHeight: { xs: '48px', sm: '56px' },  // Taller input on mobile for better touch
                    fontSize: { xs: '16px', sm: 'inherit' },  // Prevent zoom on mobile
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
                onClick={() => handleSendMessage()}
                sx={{
                  minWidth: { xs: '100%', sm: '120px' },  // Full width on mobile
                  minHeight: { xs: '48px', sm: '56px' },  // Taller button on mobile for better touch
                  background: '#5940A8 !important',
                  color: '#ffffff',
                  fontSize: { xs: '16px', sm: 'inherit' },  // Larger text on mobile
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
