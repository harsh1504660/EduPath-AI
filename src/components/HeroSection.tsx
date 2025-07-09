import { Link } from 'react-router-dom';
import { Upload, Edit3, Brain, ArrowRight, MessageCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4 sm:mb-6 leading-tight sm:leading-snug">
            AI-powered Learning
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 font-semibold block leading-normal mt-2">
              Roadmaps & Tutoring
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl sm:max-w-3xl mx-auto">
            Transform your syllabus into a personalized learning journey. Get day-wise roadmaps 
            and learn with our AI tutor that adapts to your pace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 text-sm sm:text-base"
            >
              <Upload className="h-5 w-5 mr-2" />
              Get started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 text-sm sm:text-base"
            >
              <span>Learn More</span>
            </Link>
          </div>

          {/* How it works section */}
          <div className="max-w-4xl mx-auto px-2 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              How It Works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="bg-blue-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  1. Upload or Enter
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Upload your syllabus PDF or manually enter the topics you want to learn
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="bg-green-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  2. AI Generates Plan
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Our AI creates a personalized day-wise learning roadmap tailored to your timeline
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="bg-purple-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  3. Learn with AI Tutor
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Interactive chatbot guides you through each topic step-by-step at your own pace
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
