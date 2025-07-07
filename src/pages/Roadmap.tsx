
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Download, RefreshCw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RoadmapDay {
  day: number;
  topic: string;
  description: string;
  completed: boolean;
}

const RoadmapPage = () => {
  const [roadmapData, setRoadmapData] = useState<RoadmapDay[]>([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from localStorage or generate sample data
    const savedData = localStorage.getItem('learningData');
    if (savedData) {
      const { topics, days } = JSON.parse(savedData);
      generateRoadmap(topics, days);
    } else {
      // Sample roadmap data
      generateSampleRoadmap();
    }
  }, []);

  const generateRoadmap = (topics: string, totalDays: number) => {
    // Simple AI simulation - split topics across days
    const topicsList = topics.split('\n').filter(t => t.trim());
    const daysPerTopic = Math.ceil(totalDays / topicsList.length);
    
    const roadmap: RoadmapDay[] = [];
    let currentDay = 1;
    
    topicsList.forEach((topic, index) => {
      for (let i = 0; i < daysPerTopic && currentDay <= totalDays; i++) {
        roadmap.push({
          day: currentDay,
          topic: topic.trim(),
          description: `Deep dive into ${topic.trim()} - ${i === 0 ? 'Introduction and basics' : i === 1 ? 'Practice and examples' : 'Advanced concepts'}`,
          completed: false
        });
        currentDay++;
      }
    });
    
    setRoadmapData(roadmap);
  };

  const generateSampleRoadmap = () => {
    const sampleTopics = [
      { topic: "JavaScript Fundamentals", description: "Variables, functions, and basic syntax" },
      { topic: "DOM Manipulation", description: "Selecting and modifying HTML elements" },
      { topic: "Async JavaScript", description: "Promises, async/await, and API calls" },
      { topic: "React Basics", description: "Components, JSX, and props" },
      { topic: "React Hooks", description: "useState, useEffect, and custom hooks" },
      { topic: "State Management", description: "Context API and Redux basics" },
      { topic: "React Router", description: "Navigation and routing in React apps" },
      { topic: "API Integration", description: "Fetching and managing data" },
      { topic: "Testing", description: "Unit tests and integration tests" },
      { topic: "Deployment", description: "Building and deploying React apps" }
    ];

    const roadmap = sampleTopics.map((item, index) => ({
      day: index + 1,
      topic: item.topic,
      description: item.description,
      completed: index < 2 // Mark first 2 as completed for demo
    }));

    setRoadmapData(roadmap);
    setProgress(20); // 2 out of 10 completed
  };

  const toggleComplete = (dayIndex: number) => {
    const updated = [...roadmapData];
    updated[dayIndex].completed = !updated[dayIndex].completed;
    setRoadmapData(updated);
    
    const completedCount = updated.filter(item => item.completed).length;
    setProgress((completedCount / updated.length) * 100);
  };

  const startLearning = () => {
    const currentTopic = roadmapData.find(item => !item.completed);
    if (currentTopic) {
      localStorage.setItem('currentTopic', JSON.stringify(currentTopic));
      navigate('/chatbot');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Learning Plan
          </h1>
          <p className="text-lg text-gray-600">
            Follow this personalized roadmap to master your topics
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Overall Progress
              </span>
              <span className="text-sm text-gray-600">
                {roadmapData.filter(item => item.completed).length} of {roadmapData.length} completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{Math.round(progress)}% Complete</span>
              <span>{roadmapData.length - roadmapData.filter(item => item.completed).length} days remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={startLearning} className="bg-blue-600 hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Start Learning
          </Button>
          <Button variant="outline" onClick={generateSampleRoadmap}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate Plan
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-4">
          {roadmapData.map((item, index) => (
            <Card 
              key={index} 
              className={`transition-all hover:shadow-md ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-white'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Day Circle */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    item.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      item.day
                    )}
                  </div>
                  
                  {/* Content */}
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
                    
                    <Button
                      size="sm"
                      variant={item.completed ? "outline" : "default"}
                      onClick={() => toggleComplete(index)}
                      className={item.completed ? "text-green-600 border-green-300" : ""}
                    >
                      {item.completed ? 'Completed ✓' : 'Mark Complete'}
                    </Button>
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
