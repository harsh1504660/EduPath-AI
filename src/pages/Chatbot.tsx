
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, User, ArrowLeft, SkipForward, RotateCcw, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface TopicStep {
  step: number;
  title: string;
  content: string;
  completed: boolean;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentTopic, setCurrentTopic] = useState('JavaScript Fundamentals');
  const [topicSteps, setTopicSteps] = useState<TopicStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize topic and steps
    const savedTopic = localStorage.getItem('currentTopic');
    if (savedTopic) {
      const topic = JSON.parse(savedTopic);
      setCurrentTopic(topic.topic);
    }

    initializeSteps();
    sendWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSteps = () => {
    const steps = [
      {
        step: 1,
        title: "Introduction to Variables",
        content: "Let's start with variables in JavaScript. Variables are containers that store data values. In JavaScript, you can declare variables using 'var', 'let', or 'const'.",
        completed: false
      },
      {
        step: 2,
        title: "Data Types",
        content: "JavaScript has several data types: strings, numbers, booleans, objects, arrays, and more. Each type serves different purposes in your code.",
        completed: false
      },
      {
        step: 3,
        title: "Functions Basics",
        content: "Functions are reusable blocks of code. You can create them using function declarations, function expressions, or arrow functions.",
        completed: false
      },
      {
        step: 4,
        title: "Control Structures",
        content: "Learn about if/else statements, loops (for, while), and switch statements to control the flow of your program.",
        completed: false
      },
      {
        step: 5,
        title: "Practice Exercise",
        content: "Now let's put it all together with a hands-on exercise that combines variables, functions, and control structures.",
        completed: false
      }
    ];
    setTopicSteps(steps);
  };

  const sendWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: Date.now(),
      text: `Hello! I'm your AI tutor. I'm here to help you learn ${currentTopic}. We'll go through this step by step at your own pace. Ready to start with the first lesson?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.toLowerCase().trim();
    sendMessage(inputValue, 'user');
    setInputValue('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(userMessage);
    }, 1000);
  };

  const handleBotResponse = (userInput: string) => {
    if (userInput.includes('next') || userInput.includes('continue')) {
      proceedToNextStep();
    } else if (userInput.includes('repeat') || userInput.includes('again')) {
      repeatCurrentStep();
    } else if (userInput.includes('help')) {
      sendMessage("I'm here to help! You can say 'next' to move to the next step, 'repeat' to hear the current step again, or ask me any questions about the topic.", 'bot');
    } else {
      // General AI response
      const responses = [
        "That's a great question! Let me explain that further...",
        "I understand your confusion. Let me break that down for you...",
        "Excellent observation! Here's what you need to know...",
        "Good thinking! Let me provide more details on that..."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      sendMessage(randomResponse, 'bot');
    }
  };

  const proceedToNextStep = () => {
    if (currentStep < topicSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      // Mark current step as completed
      const updatedSteps = [...topicSteps];
      updatedSteps[currentStep].completed = true;
      setTopicSteps(updatedSteps);
      
      const nextStep = topicSteps[nextStepIndex];
      sendMessage(`Great! Let's move to Step ${nextStep.step}: ${nextStep.title}. ${nextStep.content}`, 'bot');
    } else {
      sendMessage("Congratulations! You've completed all steps for this topic. Would you like to go back to your roadmap to continue with the next topic?", 'bot');
    }
  };

  const repeatCurrentStep = () => {
    const step = topicSteps[currentStep];
    sendMessage(`Let me repeat Step ${step.step}: ${step.title}. ${step.content}`, 'bot');
  };

  const quickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getProgress = () => {
    const completedSteps = topicSteps.filter(step => step.completed).length;
    return (completedSteps / topicSteps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/roadmap" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Tutor</h1>
                <p className="text-sm text-gray-600">Learning: {currentTopic}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-5 w-5 mt-1 text-white flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto mb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => quickAction('next')}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Next Step
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => quickAction('repeat')}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Repeat
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => quickAction('help')}
              >
                Help
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question or type 'next' to continue..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 hidden lg:block">
        <div className="space-y-6">
          {/* Topic Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Topic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={getProgress()} />
                <p className="text-sm text-gray-600">
                  {topicSteps.filter(s => s.completed).length} of {topicSteps.length} steps completed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Steps List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topicSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      index === currentStep
                        ? 'bg-blue-50 border border-blue-200'
                        : step.completed
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : step.step}
                    </div>
                    <span className={`text-sm ${
                      index === currentStep ? 'font-medium text-blue-900' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Topic */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium text-gray-900 mb-2">{currentTopic}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Master the fundamentals through interactive lessons
              </p>
              <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-center">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Interactive learning in progress
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
