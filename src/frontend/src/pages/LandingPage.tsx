import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { FileText, Brain, Shield, Calendar, BookOpen, Bell, Scale, Stethoscope } from 'lucide-react';

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="AI-Powered Intelligent Notes"
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            AI-Powered Multi-Domain Intelligent Notes
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Automatic document classification, medical & legal analysis, smart timetables, AI-generated quizzes, and intelligent revision reminders
          </p>
          
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isLoggingIn ? 'Connecting...' : 'Get Started Free'}
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Medical Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI extracts key findings, diagnoses, and medical terms from reports
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Legal Documents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyze clauses, obligations, rights, and parties in legal documents
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Smart Notes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-enhanced notes with automatic summaries and key point extraction
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Smart Timetable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage classes, study sessions, exams, and deadlines effortlessly
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Auto Quizzes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI generates quizzes from your notes to test comprehension
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Revision Reminders</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track revision count and get scheduled reminders to review topics
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Auto Classification</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Documents automatically classified into medical, legal, or general
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Secure & Private</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your data is encrypted and stored securely on the blockchain
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to supercharge your learning?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Join students and professionals using AI to organize, analyze, and master their knowledge
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              {isLoggingIn ? 'Connecting...' : 'Start Learning Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
