
import { GraduationCap, Target, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About EduPath AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revolutionizing education through AI-powered personalized learning experiences
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Target className="h-6 w-6 mr-2 text-purple-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">
              At EduPath AI, we believe that every student deserves a personalized learning experience 
              that adapts to their pace, style, and goals. Our platform combines artificial intelligence 
              with proven educational methodologies to create dynamic learning roadmaps and provide 
              one-on-one tutoring support.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                Personalized Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Upload your syllabus or enter topics manually, and our AI creates a customized 
                day-wise learning plan that fits your schedule and learning objectives.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-pink-600" />
                AI-Powered Tutoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our intelligent chatbot tutor provides step-by-step guidance, answers questions, 
                and adapts to your learning pace for maximum comprehension.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Interactive Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Engage with multimedia content, practice exercises, and real-time feedback 
                to enhance your understanding and retention.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-emerald-600" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor your learning journey with detailed progress tracking, completion 
                statistics, and personalized recommendations for improvement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl">How EduPath AI Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-purple-600 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Content Input</h3>
                  <p className="text-gray-600">
                    Upload your syllabus PDF or manually enter the topics you want to learn. 
                    Specify your desired timeline for completion.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-pink-600 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
                  <p className="text-gray-600">
                    Our AI analyzes your content and creates an optimized day-wise learning 
                    roadmap tailored to your goals and timeline.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Interactive Learning</h3>
                  <p className="text-gray-600">
                    Start learning with our AI tutor chatbot that guides you through each 
                    topic step-by-step, providing explanations and answering questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-emerald-600 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Progress & Mastery</h3>
                  <p className="text-gray-600">
                    Track your progress, complete assessments, and master each topic before 
                    moving on to the next phase of your learning journey.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl">About the Creator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">H</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Harsh</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                EduPath AI was created with a passion for making quality education accessible 
                to everyone. By leveraging the power of artificial intelligence, we're building 
                tools that help students learn more effectively and achieve their educational goals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
