import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Send, Bot, User, ArrowLeft, SkipForward, RotateCcw,
  Volume2, VolumeX, Menu, X, ChevronRight, Play

} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
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
  image?: string | null;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [topicSteps, setTopicSteps] = useState<TopicStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [parsedVideoUrl, setParsedVideoUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.lang = 'en-US';

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      [
        'Google UK English Female',
        'Google US English',
        'Microsoft Aria Online (Natural)',
        'Microsoft Jenny Online (Natural)',
        'Microsoft Emma Online (Natural)',
        'Microsoft Zira Desktop',
        'Google UK English Male',
      ].some((name) => voice.name.includes(name))
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const savedExplainer = localStorage.getItem('currentExplainer');
    try {
      if (!savedExplainer) throw new Error('Explainer not found');
      const parsed = JSON.parse(savedExplainer);
      if (!parsed?.results || !Array.isArray(parsed.results) || !parsed.results[0]?.steps) {
        throw new Error('Malformed explainer data');
      }

      const explainer = parsed.results[0];
      setCurrentTopic(explainer.topic || 'Unknown Topic');

      const steps = explainer.steps.map((step: any, idx: number) => ({
        step: idx + 1,
        title: step.title,
        content: step.explanation,
        image: step.image || null,
        completed: false,
      }));
      setTopicSteps(steps);

      const welcome = `Hi! Let's learn about: ${explainer.topic}`;
      const firstStep = `Step 1: ${steps[0].title}. ${steps[0].content}`;

      setMessages([
        { id: Date.now(), text: welcome, sender: 'bot', timestamp: new Date() },
        { id: Date.now() + 1, text: firstStep, sender: 'bot', timestamp: new Date() },
      ]);

      if (explainer.video) {
        const videoIdMatch = explainer.video.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
        if (videoIdMatch) {
          setParsedVideoUrl(`https://www.youtube.com/embed/${videoIdMatch[1]}`);
        }
      }

      speakText(welcome);
      speakText(firstStep);
    } catch (err) {
      console.error('Malformed explainer data', err);
      toast.error('⚠️ Explainer content could not be loaded.', {
        description: 'Please regenerate the plan.',
        position: 'top-center',
        duration: 5000,
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    if (sender === 'bot') speakText(text);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.toLowerCase().trim();
    sendMessage(inputValue, 'user');
    setInputValue('');
    setIsTyping(true);
    setSidebarOpen(false); // Close sidebar on mobile after sending
    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(userMessage);
    }, 1000);
  };

  const handleBotResponse = (userInput: string) => {
    if (userInput.includes('next')) {
      proceedToNextStep();
    } else if (userInput.includes('repeat')) {
      repeatCurrentStep();
    } else if (userInput.includes('help')) {
      sendMessage("I'm here to help! You can say 'next' to move to the next step, 'repeat' to hear the current step again, or ask questions.", 'bot');
    } else {
      sendMessage("That's a great question! Let me explain more...", 'bot');
    }
  };

  const proceedToNextStep = () => {
    const updated = [...topicSteps];
    updated[currentStep].completed = true;
    setTopicSteps(updated);

    if (currentStep < topicSteps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      const step = updated[next];
      sendMessage(`Step ${step.step}: ${step.title}. ${step.content}`, 'bot');
    } else {
      sendMessage("You've completed all the steps! 🎉 Please take a quiz on this topic, or ask doubts.", 'bot');
    }
  };

  const repeatCurrentStep = () => {
    const step = topicSteps[currentStep];
    sendMessage(`Repeating Step ${step.step}: ${step.title}. ${step.content}`, 'bot');
  };

  const quickAction = (action: string) => {
    sendMessage(action, 'user');
    setIsTyping(true);
    setSidebarOpen(false); // Close sidebar on mobile after action
    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(action.toLowerCase());
    }, 500);
  };

  const getProgress = () => {
    const completed = topicSteps.filter(s => s.completed).length;
    return (completed / topicSteps.length) * 100;
  };

  const allStepsCompleted = topicSteps.every(step => step.completed);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setSidebarOpen(false); // Close sidebar on mobile
    try {
      const explainerRaw = localStorage.getItem('currentExplainer');
      if (!explainerRaw) throw new Error('No explainer found');

      const explainer = JSON.parse(explainerRaw);
      const topicName = explainer.results?.[0]?.topic;

      if (!topicName) throw new Error('Topic not found');

      const res = await fetch('https://edupath-ai.onrender.com/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: [topicName] }) // ✅ send topic string
      });

      if (!res.ok) throw new Error('Failed to fetch quiz');
      const data = await res.json();
      localStorage.setItem('quizData', JSON.stringify(data));
      navigate('/quiz');
    } catch (err) {
      toast.error('⚠️ Cannot start the quiz', {
        description: 'Please make sure you have generated a valid plan',
        position: 'top-center',
        duration: 5000,
      });
    }
    setIsLoading(false);
  };

  const handleQuestoin = async () => {
    setLoading(true);
    setSidebarOpen(false); // Close sidebar on mobile
    try {
      const uniqueId = uuidv4();

      const parsedData = JSON.parse(localStorage.getItem('currentExplainer'));
      console.log('Parsed Data:', parsedData.results[0].topic);

      const res = await fetch('https://edupath-ai.onrender.com/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: uniqueId,
          topic: parsedData.results[0].topic,
          question: 'Start Question Session',
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch questions');
      
      const data = await res.json();
      localStorage.setItem('quizData', JSON.stringify(data));
      navigate('/qna/');
    } catch (err) {
      toast.error('⚠️ Cannot start the Doubt solving session', {
        description: 'Please make sure you have generated a valid plan',
        position: 'top-center',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Mobile sidebar component
  const MobileSidebar = () => (
    <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Learning Progress</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getProgress()} className="mb-2" />
              <p className="text-sm text-gray-600">
                {topicSteps.filter(s => s.completed).length} of {topicSteps.length} steps done
              </p>
            </CardContent>
          </Card>

          {/* Steps Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topicSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className={`p-3 rounded-md text-sm font-medium flex items-center justify-between ${
                    idx === currentStep
                      ? 'bg-purple-100 text-purple-800'
                      : step.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="flex-1">{step.step}. {step.title}</span>
                  {step.completed && <span className="text-green-600">✓</span>}
                  {idx === currentStep && <ChevronRight className="h-4 w-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quiz Card */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-400 text-transparent bg-clip-text">
                Take Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleStartQuiz}
                disabled={isLoading || !topicSteps.every(s => s.completed)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Starting...
                  </>
                ) : (
                  'Start Quiz'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Questions Card */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
                Have Doubts?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleQuestoin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Loading...
                  </>
                ) : (
                  'Ask Question'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Video Card */}
          {parsedVideoUrl && currentStep === topicSteps.length - 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Topic Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden border border-purple-100 shadow">
                  <iframe
                    width="100%"
                    height="100%"
                    src={parsedVideoUrl}
                    title="Topic Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex relative">
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/80 border-b p-3 lg:p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
              <Link to="/roadmap" className="text-purple-500 hover:text-purple-600 flex-shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-xl font-semibold text-gray-800">AI Tutor</h1>
                <p className="text-xs lg:text-sm text-purple-600 truncate">
                  Learning: {currentTopic}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setVoiceEnabled(prev => {
                    if (prev) speechSynthesis.cancel();
                    return !prev;
                  });
                }}
                className="h-8 w-8 lg:h-10 lg:w-10"
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
                ) : (
                  <VolumeX className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                )}
              </Button>
              
              {/* Mobile menu button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-8 w-8"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 lg:p-2 rounded-full">
                <Bot className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-2 lg:p-4">
          <div className="max-w-4xl mx-auto space-y-3 lg:space-y-4">
            {messages.map((message) => {
              if (message.text.startsWith('__IMAGE__')) {
                const url = message.text.replace('__IMAGE__', '');
                return (
                  <div key={message.id} className="flex justify-start">
                    <img 
                      src={url} 
                      alt="Step visual" 
                      className="rounded-md border w-full max-w-xs lg:max-w-lg" 
                    />
                  </div>
                );
              }
              return (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] lg:max-w-xs xl:max-w-md px-3 lg:px-4 py-2 lg:py-3 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/80 text-gray-800 border border-purple-100 backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full flex-shrink-0">
                          <Bot className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                        </div>
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 lg:h-5 lg:w-5 mt-0.5 text-white flex-shrink-0" />
                      )}
                      <p className="text-sm leading-relaxed break-words">{message.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 text-gray-800 border border-purple-100 px-3 lg:px-4 py-2 lg:py-3 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
                      <Bot className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step Image */}
            {topicSteps[currentStep]?.image && (
              <Card className="w-fit mx-auto">
                <CardContent className="p-2 lg:p-4">
                  <img
                    src={topicSteps[currentStep].image as string}
                    alt={`Step ${currentStep + 1}`}
                    className="rounded-xl max-w-full h-auto max-h-[300px] lg:max-h-[500px] object-contain border border-purple-200 shadow-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Video for mobile */}
            {parsedVideoUrl && currentStep === topicSteps.length - 1 && (
              <div className="max-w-full lg:max-w-xl mx-auto mt-4 lg:mt-6 lg:hidden">
                <Card>
                  <CardContent className="p-2">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={parsedVideoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Topic Video"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Video for desktop */}
            {parsedVideoUrl && currentStep === topicSteps.length - 1 && (
              <div className="max-w-xl mx-auto mt-6 hidden lg:block">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={parsedVideoUrl}
                    className="rounded-md border w-full h-64"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Topic Video"
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="bg-white/80 border-t p-3 lg:p-4">
          {/* Quick Actions */}
          <div className="max-w-4xl mx-auto mb-3 lg:mb-4 flex gap-2 flex-wrap justify-center">
            <Button 
              className="bg-gradient-to-r from-green-500 to-green-400 text-white hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 ring-2 ring-green-300/40 text-xs lg:text-sm"
              size="sm" 
              onClick={() => quickAction('next')}
            >
              <SkipForward className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              Next
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-400 to-blue-300 text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 ring-2 ring-blue-300/40 text-xs lg:text-sm"
              size="sm" 
              onClick={() => quickAction('repeat')}
            >
              <RotateCcw className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              Repeat
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-purple-400 text-white hover:bg-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 ring-2 ring-purple-300/40 text-xs lg:text-sm"
              size="sm" 
              onClick={() => quickAction('help')}
            >
              Help
            </Button>
          </div>

          {/* Input */}
         
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="w-80 hidden lg:flex flex-col bg-white/80 border-l p-6 space-y-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getProgress()} className="mb-2" />
            <p className="text-sm text-gray-600">
              {topicSteps.filter(s => s.completed).length} of {topicSteps.length} steps done
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-md">Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topicSteps.map((step, idx) => (
              <div
                key={step.step}
                className={`p-2 rounded-md text-sm font-medium ${
                  idx === currentStep
                    ? 'bg-purple-100 text-purple-800'
                    : step.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {step.step}. {step.title}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-400 text-transparent bg-clip-text">
              Take Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              title={!topicSteps.every(s => s.completed) ? 'Complete all topics to access the quiz' : ''}
              className="inline-block"
            >
              <Button
                onClick={handleStartQuiz}
                disabled={isLoading || !topicSteps.every(s => s.completed)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Starting...
                  </>
                ) : (
                  'Start Quiz'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
              Have Doubts?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-block">
              <Button
                onClick={handleQuestoin}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Loading...
                  </>
                ) : (
                  'Ask Question'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {parsedVideoUrl && currentStep === topicSteps.length - 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Topic Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden border border-purple-100 shadow">
                <iframe
                  width="100%"
                  height="100%"
                  src={parsedVideoUrl}
                  title="Topic Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatbotPage;