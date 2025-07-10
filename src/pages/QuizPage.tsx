import { useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  Bot,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';


interface Question {
  question: string;
  options: string[];
  answer: string;
}

const QnaPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
const navigate = useNavigate();

// Function to mark roadmap topic as completed
const markRoadmapTopicCompleted = () => {
  try {
    // Get current topic from localStorage
    const currentTopicData = localStorage.getItem('currentTopic');
    if (!currentTopicData) {
      console.log('No current topic found');
      return;
    }

    const currentTopic = JSON.parse(currentTopicData);
    const topicTitle = currentTopic.topic;

    // Get roadmap data from localStorage
    const roadmapDataRaw = localStorage.getItem('roadmapData');
    if (!roadmapDataRaw) {
      console.log('No roadmap data found');
      return;
    }

    const roadmapData = JSON.parse(roadmapDataRaw);
    const plan = roadmapData['endpoint test'].plan;

    // Find the topic in the roadmap and mark it as completed
    const topicIndex = plan.findIndex((item: any) => item.topics === topicTitle);
    
    if (topicIndex !== -1) {
      plan[topicIndex].completed = true;
      localStorage.setItem('roadmapData', JSON.stringify(roadmapData));
      
      toast.success('🎉 This section is completed!', {
        description: `You've successfully completed: ${topicTitle}`,
        position: 'top-center',
        duration: 4000,
      });
      
      console.log(`Marked topic "${topicTitle}" as completed`);
    } else {
      console.log(`Topic "${topicTitle}" not found in roadmap`);
    }
  } catch (error) {
    console.error('Error marking topic as completed:', error);
  }
};

useEffect(() => {
  const stored = localStorage.getItem('quizData');
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);

    let jsonContent;

    // Case 1: If `parsed.result` is a string and wrapped in code block
    if (typeof parsed.result === 'string') {
      const match = parsed.result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        jsonContent = JSON.parse(match[1]
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']'));
      } else {
        // Not a code block string — maybe it's raw JSON string
        jsonContent = JSON.parse(parsed.result);
      }
    }

    // Case 2: If `parsed.result` is already a parsed object
    else if (typeof parsed.result === 'object') {
      jsonContent = parsed.result;
    } else {
      throw new Error('Unsupported result format');
    }

    if (!jsonContent.questions || !Array.isArray(jsonContent.questions)) {
      throw new Error('Invalid quiz format: No valid questions');
    }

    setQuestions(jsonContent.questions);
  } catch (err) {
      toast.error('⚠️ Cannot start the quiz', {
  description: 'Please make sure you have generated a valid plan',
  position: 'top-center',
  duration: 5000,
});
  }
}, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentIndex]);

  const handleNext = () => {
    const isCorrect = selectedOption === questions[currentIndex].answer;
    const newScore = isCorrect ? score + 1 : score;

    if (currentIndex === questions.length - 1) {
      setScore(newScore);
      setIsFinished(true);
      
      // Check if user passed the quiz (score >= 50%)
      if (newScore >= questions.length / 2) {
        // Mark the roadmap topic as completed
        markRoadmapTopicCompleted();
      }
    } else {
      setScore(newScore);
      setSelectedOption(null);
      setShowAnswer(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="h-[80vh]  bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full h-[70vh]  max-w-4xl shadow-xl border border-purple-200">
        <CardHeader className="bg-white border-b border-purple-100">
          <CardTitle className="text-xl font-semibold flex justify-between items-center text-purple-700">
            Quiz Time 🎯
            <span className="text-sm text-gray-500">
              {isFinished
                ? 'Quiz Finished'
                : `Q ${currentIndex + 1} of ${questions.length} — ${questions.length - currentIndex - 1} remaining`}
            </span>
          </CardTitle>
        </CardHeader>

        <ScrollArea className="h-[70vh] p-6">
          <CardContent className="space-y-6">
            {!isFinished && currentQuestion && (
              <>
                <div className="flex items-start gap-3 bg-white border border-purple-100 p-4 rounded-xl shadow-sm">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm leading-relaxed text-gray-800">
                    <strong>Q{currentIndex + 1}:</strong> {currentQuestion.question}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((opt, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className={`justify-start text-left w-full text-sm p-3 rounded-xl border shadow-sm transition-colors duration-150
                        ${showAnswer && opt === currentQuestion.answer ? 'border-green-500 text-green-700 bg-green-50' : ''}
                        ${showAnswer && selectedOption === opt && opt !== currentQuestion.answer ? 'border-red-500 text-red-600 bg-red-50' : ''}`}
                      onClick={() => {
                        setSelectedOption(opt);
                        setShowAnswer(true);
                      }}
                      disabled={showAnswer}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>

                {showAnswer && (
                  <p className="text-sm mt-2 text-gray-600 flex items-center gap-2">
                    {selectedOption === currentQuestion.answer ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" /> Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" /> Correct Answer:{' '}
                        <strong>{currentQuestion.answer}</strong>
                      </>
                    )}
                  </p>
                )}

                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleNext}
                    disabled={!showAnswer}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  >
                    {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </div>
              </>
            )}

{isFinished && (
  <div className="flex flex-col items-center justify-center text-center mt-8 space-y-6">
    <div
      className={`w-full max-w-md bg-white shadow-md rounded-2xl p-6 border ${
        score >= questions.length / 2 ? 'border-green-300' : 'border-red-300'
      }`}
    >
      <h2
        className={`text-3xl font-bold ${
          score >= questions.length / 2 ? 'text-green-600' : 'text-red-600'
        } flex items-center justify-center gap-2`}
      >
        {score >= questions.length / 2 ? (
          <>
            ✅ You Passed!
          </>
        ) : (
          <>
            ❌ You Failed
          </>
        )}
      </h2>

      <p className="text-xl font-medium mt-4 text-gray-800">
        Your Score:
        <span className="ml-2 font-bold text-purple-700">
          {score} / {questions.length}
        </span>
      </p>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setIsFinished(false);
            setSelectedOption(null);
            setShowAnswer(false);
          }}
          className="bg-purple-400 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
        >
          Retake Quiz
        </Button>

        <Button
          onClick={() => navigate('/roadmap')}
          className="bg-purple-200 hover:bg-gray-300 text-purple-700 font-semibold px-6 py-2 rounded-lg"
        >
          Return to Roadmap
        </Button>
      </div>
    </div>
  </div>
)}
            <div ref={messagesEndRef} />
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default QnaPage;