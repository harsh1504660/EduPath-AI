import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sessionId, setSessionId] = useState(() => {
    const saved = localStorage.getItem('session_id');
    return saved || uuidv4();
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('session_id', sessionId);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const parsedData = JSON.parse(localStorage.getItem('currentExplainer'));
    const topic = parsedData?.results?.[0]?.topic || 'your topic';
    sendMessage(
      `👋 Hi there! I'm your study assistant. Ask me anything about "${topic}" and I'll help you step by step.`,
      'bot'
    );
  }, []);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.lang = 'en-US';
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0];
    speechSynthesis.speak(utterance);
  };

  const sendMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    if (sender === 'bot') speakText(text);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.toLowerCase().trim();
    sendMessage(inputValue, 'user');
    setInputValue('');
    setIsTyping(true);

    try {
      const parsedData = JSON.parse(localStorage.getItem('currentExplainer'));
      const topic = parsedData?.results?.[0]?.topic || 'General';

      const response = await fetch('http://localhost:8000/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          topic,
          question: userMessage,
        }),
      });

      const data = await response.json();
      setIsTyping(false);
      sendMessage(data.answer || 'Sorry, I didn\'t understand that.', 'bot');
    } catch (err) {
      setIsTyping(false);
      sendMessage("Oops! Something went wrong. Please try again.", 'bot');
    }
  };

  const handleNewChat = () => {
    const newId = uuidv4();
    const parsedData = JSON.parse(localStorage.getItem('currentExplainer'));
    const topic = parsedData?.results?.[0]?.topic || 'your topic';
    setSessionId(newId);
    localStorage.setItem('session_id', newId);
    setMessages([]);
       sendMessage(
      `👋 Hi there ! welcome again I'm your study assistant. Ask me anything about "${topic}" and I'll help you step by step.`,
      'bot'
    );
    speakText("Started a new chat.");
  };

  return (
    <div className="h-[80vh] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      <ScrollArea className="flex-1 p-4 overflow-y-auto max-w-4xl mx-auto w-full">
        <div className="space-y-4 ">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/80 text-gray-800 border border-purple-100 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {message.sender === 'user' && <User className="h-5 w-5 mt-1 text-white" />}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/80 text-gray-800 border border-purple-100 px-4 py-3 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
                    <Bot className="h-4 w-4 text-white" />
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

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="bg-white/80 border-t p-4">
        <div className="max-w-4xl mx-auto flex space-x-2">
          
      <Button className='h-10 w-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-purple-400 hover:shadow-xl transform hover:-translate-y-1 duration-200' onClick={handleNewChat} variant="outline" title="New Chat">
  <PlusCircle className="h-6 w-6 text-white " />
</Button>
         
        <Input
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
  placeholder="Ask something..."
  className="flex-1 border-2 border-purple-300 focus:!border-purple-700 focus:!outline-none focus:!ring-0"
/>
          <Button onClick={() => setVoiceEnabled((prev) => !prev)} variant="ghost">
            {voiceEnabled ? <Volume2 className="text-green-600" /> : <VolumeX className="text-gray-400" />}
          </Button>
          <Button className='bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-purple-400 hover:shadow-xl transform hover:-translate-y-1 duration-200' onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
          
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;