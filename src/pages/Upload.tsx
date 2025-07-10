import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Calendar, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const UploadPage = () => {
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'manual'>('pdf');
  const [topics, setTopics] = useState('');
  const [days, setDays] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Load demo PDF from public directory
  const handleDemoUpload = async () => {
    try {
      const response = await fetch('/demo-syllabus.pdf');
      const blob = await response.blob();
      const demoFile = new File([blob], 'demo-syllabus.pdf', { type: 'application/pdf' });
      
      setPdfFile(demoFile);
      setIsDemo(true);
      setDays('30'); // Set default demo duration
      
      toast({
        title: 'Demo PDF loaded!',
        description: 'Sample syllabus ready for processing',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Demo PDF not found',
        description: 'Please make sure demo-syllabus.pdf is in the public directory',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    if (!days || parseInt(days) <= 0) {
      toast({
        title: 'Invalid duration',
        description: 'Please enter a valid number of days',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    if (uploadMethod === 'pdf') {
      if (!pdfFile) {
        toast({
          title: 'No PDF uploaded',
          description: 'Please upload your syllabus PDF or try the demo',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('total_days', String(parseInt(days)));
      formData.append('file', pdfFile);

      try {
        const res = await fetch('https://edupath-ai.onrender.com/planner', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data) {
          localStorage.setItem('roadmapData', JSON.stringify(data));
          navigate('/roadmap');
        } else {
          toast({
            title: 'Failed to generate roadmap',
            description: 'Please try again.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error',
          description: 'Something went wrong while generating your plan.',
          variant: 'destructive',
        });
      }
    } else {
      // Manual entry block
      if (!topics.trim()) {
        toast({
          title: 'Please enter topics',
          description: 'Add the topics you want to learn',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      try {
        console.log('Sending days (manual):', parseInt(days));
        const res = await fetch('https://edupath-ai.onrender.com/planner-manual', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total_days: parseInt(days),
            topic: topics.trim(),
          }),
        });

        const data = await res.json();
        if (data) {
          localStorage.setItem('roadmapData', JSON.stringify(data));
          navigate('/roadmap');
        } else {
          toast({
            title: 'Failed to generate roadmap',
            description: 'Please try again.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error',
          description: 'Something went wrong while generating your plan.',
          variant: 'destructive',
        });
      }
    }
    
    setLoading(false);
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
        setPdfFile(file);
        setIsDemo(false);
        toast({
          title: 'PDF uploaded successfully!',
          description: `File: ${file.name}`,
        });
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setIsDemo(false);
      toast({
        title: 'PDF uploaded!',
        description: `File: ${file.name}`,
      });
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Create Your Learning Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your syllabus or enter topics manually to generate a personalized roadmap
          </p>
        </div>

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
          <div className="md:col-span-2">
            {uploadMethod === 'pdf' ? (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Upload className="h-5 w-5 mr-2 text-purple-600" />
                      Upload Syllabus PDF
                    </div>
                    <Button
                      onClick={handleDemoUpload}
                      variant="outline"
                      size="sm"
                      className="flex items-center bg-purple-300 gap-2 hover:bg-pink-200"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Try Demo PDF
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {pdfFile ? `Selected: ${pdfFile.name}` : 'Drop your PDF here'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {pdfFile ? (isDemo ? 'Demo file loaded' : 'File ready for processing') : 'or click to browse files'}
                    </p>
                    {!pdfFile && (
                      <Input type="file" accept="application/pdf" onChange={handleFileInput} />
                    )}
                    {pdfFile && (
                      <Button
                        onClick={() => {
                          setPdfFile(null);
                          setIsDemo(false);
                        }}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Remove File
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Enter Topic Manually
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter any topic you want to learn..."
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
                    placeholder=" 30"
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
              disabled={loading}
              className="w-full mt-6 py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                <>
                  Generate My Roadmap
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Sidebar Card */}
          <div className="hidden md:block">
            <Card className="h-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-16 w-16 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Planning</h3>
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