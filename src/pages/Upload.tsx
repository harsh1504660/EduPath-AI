import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const UploadPage = () => {
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'manual'>('pdf');
  const [topics, setTopics] = useState('');
  const [days, setDays] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (uploadMethod === 'manual' && !topics.trim()) {
      toast({
        title: "Please enter topics",
        description: "Add the topics you want to learn",
        variant: "destructive"
      });
      return;
    }
    
    if (!days || parseInt(days) <= 0) {
      toast({
        title: "Invalid duration",
        description: "Please enter a valid number of days",
        variant: "destructive"
      });
      return;
    }

    // Store data for roadmap generation
    localStorage.setItem('learningData', JSON.stringify({
      method: uploadMethod,
      topics: uploadMethod === 'manual' ? topics : 'Sample syllabus content',
      days: parseInt(days)
    }));

    toast({
      title: "Generating your roadmap...",
      description: "Please wait while we create your personalized learning plan"
    });

    setTimeout(() => {
      navigate('/roadmap');
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        toast({
          title: "PDF uploaded successfully!",
          description: `File: ${file.name}`
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Create Your Learning Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your syllabus or enter topics manually to generate a personalized roadmap
          </p>
        </div>

        {/* Method Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-white/20">
            <button
              onClick={() => setUploadMethod('pdf')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                uploadMethod === 'pdf'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setUploadMethod('manual')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                uploadMethod === 'manual'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enter Manually
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {uploadMethod === 'pdf' ? (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-purple-600" />
                    Upload Syllabus PDF
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Drop your PDF here
                    </h3>
                    <p className="text-gray-600 mb-4">
                      or click to browse files
                    </p>
                    <Button variant="outline">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Enter Topics Manually
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter topics you want to learn, one per line:

JavaScript Fundamentals
React Components
State Management
API Integration
Testing
Deployment"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </CardContent>
              </Card>
            )}

            {/* Days Input */}
            <Card className="mt-6 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Learning Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="30"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-32"
                    min="1"
                    max="365"
                  />
                  <span className="text-gray-600">days to complete</span>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleSubmit}
              className="w-full mt-6 py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
              size="lg"
            >
              Generate My Roadmap
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Side Illustration */}
          <div className="hidden md:block">
            <Card className="h-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-16 w-16 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart Planning
                </h3>
                <p className="text-gray-600 text-sm">
                  Our AI analyzes your content and creates an optimal learning schedule that fits your timeline
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
