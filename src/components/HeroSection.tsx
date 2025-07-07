
import { Link } from 'react-router-dom';
import { Upload, Edit3, Brain, ArrowRight, MessageCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-powered Learning
            <span className="text-blue-600 block">Roadmaps & Tutoring</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your syllabus into a personalized learning journey. Get day-wise roadmaps 
            and learn with our AI tutor that adapts to your pace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/upload"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Syllabus
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            
            <Link
              to="/upload"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
            >
              <Edit3 className="h-5 w-5 mr-2" />
              Enter Topics Manually
            </Link>
          </div>
          
          {/* How it works section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Upload or Enter</h3>
                <p className="text-gray-600">Upload your syllabus PDF or manually enter the topics you want to learn</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. AI Generates Plan</h3>
                <p className="text-gray-600">Our AI creates a personalized day-wise learning roadmap tailored to your timeline</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Learn with AI Tutor</h3>
                <p className="text-gray-600">Interactive chatbot guides you through each topic step-by-step at your own pace</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
