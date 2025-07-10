import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Play,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
interface RoadmapDay {
  day: number;
  topic: string;
  description: string;
  completed: boolean;
}

const RoadmapPage = () => {
  const [roadmapData, setRoadmapData] = useState<RoadmapDay[]>([]);
  const [progress, setProgress] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const alreadyCelebrated = localStorage.getItem('celebrated');
  if (progress === 100 && !alreadyCelebrated) {
    launchConfetti();
    localStorage.setItem('celebrated', 'true');
  }
}, [progress]);
useEffect(() => {
  if (progress === 100) {
    launchConfetti();
  }
}, [progress]);


const handleDownload = () => {
  toast.info(`🚧 Don't worry! We are working on this`, {
        description: 'Download PDF feature is coming soon!',
        position: 'top-center',
        duration: 5000,
      });
}

const launchConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#bb0000', '#ffffff', '#ffcc00', '#00cc99', '#9966ff']
  });
};
 useEffect(() => {
  const raw = localStorage.getItem('roadmapData');
  if (raw) {
    try {
      const { plan } = JSON.parse(raw)['endpoint test'];
      const mapped: RoadmapDay[] = plan.map((entry: any, idx: number) => ({
        day: idx + 1,
        topic: entry.topics,
        description: `Study topics: ${entry.topics}`,
        completed: entry.completed || false
      }));
      setRoadmapData(mapped);

      // Update initial progress
      const completedCount = mapped.filter((item) => item.completed).length;
      setProgress((completedCount / mapped.length) * 100);
    } catch (err) {
      console.error('Error parsing roadmap:', err);
    }
  }
}, []);

const toggleComplete = (index: number) => {
  const updated = [...roadmapData];
  updated[index].completed = !updated[index].completed;
  setRoadmapData(updated);

  // Save to localStorage
  const raw = localStorage.getItem('roadmapData');
  
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      parsed['endpoint test'].plan[index].completed = updated[index].completed;
      localStorage.setItem('roadmapData', JSON.stringify(parsed));
    } catch (err) {
      console.error('Failed to update roadmapData in localStorage:', err);
    }
  }

  const completedCount = updated.filter((item) => item.completed).length;
  setProgress((completedCount / updated.length) * 100);

  // Reset celebration flag if user marks something incomplete
  if (progress === 100 && updated[index].completed === false) {
    localStorage.removeItem('celebrated');
  }
};

const startLearning = async () => {
  const currentTopic = roadmapData.find((item) => !item.completed);
  const existingExplainer = localStorage.getItem('currentExplainer');

  if (existingExplainer && currentTopic) {
    // Small button already used — just navigate
    localStorage.setItem('currentTopic', JSON.stringify(currentTopic));
    navigate('/chatbot');
    console.log('Redirecting to chatbot (already loaded):', currentTopic);
  } else if (currentTopic) {
    try {
      setLoadingIndex(-1); // show global loading

      const response = await fetch('https://edupath-ai.onrender.com/explainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics: [currentTopic.topic] }),
      });

      if (!response.ok) throw new Error('Failed to fetch explainer');

      const data = await response.json();

      localStorage.setItem(
        'currentExplainer',
        JSON.stringify({ results: [data.results[0]] })
      );
      localStorage.setItem('currentTopic', JSON.stringify(currentTopic));
      navigate('/chatbot');
    } catch (err) {
      console.error('Error loading explainer:', err);
    } finally {
      setLoadingIndex(null);
    }
  } else {
    // Optional: when all topics are completed
    console.log('All topics completed');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Your Learning Plan
          </h1>
          <p className="text-lg text-gray-600">
            Follow this personalized roadmap to master your topics
          </p>
        </div>
        {progress === 100 && (
  <div className="text-center mb-6">
    
    
   <div className="flex items-center justify-center gap-2">
  <span className='text-2xl'>🎉</span>
  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
    Congratulations! You've completed your roadmap!
  </h2>
  <span className='text-2xl'>🎉</span>
</div>
    
    <p className="text-gray-600 mt-2">
      You're all set! Go ahead and explore more or review topics again.
    </p>
  </div>
)}

        {/* Progress */}
<Card className="mb-8 shadow-lg bg-white/90 backdrop-blur-sm border border-purple-100">
  <CardHeader>
    <CardTitle className="flex items-center justify-between">
      <span className="flex items-center">
        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
        Overall Progress
      </span>
      <span className="text-sm text-gray-600">
        {roadmapData.filter((item) => item.completed).length} of{' '}
        {roadmapData.length} completed
      </span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Progress value={progress} className="mb-4" />
    <div className="flex justify-between text-sm text-gray-600">
      <span>{Math.round(progress)}% Complete</span>
      <span>
        {roadmapData.length -
          roadmapData.filter((item) => item.completed).length}{' '}
        days remaining
      </span>
    </div>
  </CardContent>
</Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
  onClick={startLearning}
  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
  disabled={loadingIndex === -1}
>
  {loadingIndex === -1 ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Loading...
    </>
  ) : (
    <>
      <Play className="h-4 w-4 mr-2" />
      Start Learning
    </>
  )}
</Button>
          <Button className='inline-flex items-center px-8 py-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200' variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2 text-purple-500 drop-shadow-md" />
            Regenerate Plan
          </Button>
          <Button onClick={handleDownload} className='inline-flex items-center px-8 py-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200' variant="outline">
            <Download className="h-4 w-4 mr-2 text-purple-500 drop-shadow-md" />
            Download PDF
          </Button>
        </div>

        {/* Roadmap Cards */}
        <div className="space-y-4">
          {roadmapData.map((item, index) => (
            <Card
              key={index}
              className={`mb-8 shadow-lg bg-white/90 backdrop-blur-sm border border-purple-100" ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-white'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      item.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      item.day
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Day {item.day}: {item.topic}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">2-3 hours</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{item.description}</p>

                    <div className="flex gap-3 flex-wrap">
                      <Button
                        size="sm"
                        variant={item.completed ? 'outline' : 'default'}
                        onClick={() => toggleComplete(index)}
                        className={
                          item.completed
                            ? 'text-green-600 border-green-300'
                            : 'bg-purple-400  text-white hover:bg-purple-700'
                        }
                      >
                        {item.completed ? 'Completed ✓' : 'Mark Complete'}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={loadingIndex === index}
                        onClick={async () => {
                          try {
                            setLoadingIndex(index);
                            const response = await fetch(
                              'https://edupath-ai.onrender.com/explainer',
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  topics: [item.topic]
                                })
                              }
                            );

                            if (!response.ok)
                              throw new Error('Failed to fetch explanation');

                            const data = await response.json();
                            localStorage.setItem(
                              'currentExplainer',
                              JSON.stringify({ results: [data.results[0]] })
                            );
                            localStorage.setItem(
                              'currentTopic',
                              JSON.stringify(item)
                            );

                            navigate('/chatbot');
                          } catch (err) {
                            console.error('Error loading explainer:', err);
                            alert('Failed to load explainer. Please try again.');
                          } finally {
                            setLoadingIndex(null);
                          }
                        }}
                      >
                        {loadingIndex === index ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Start Learning'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
