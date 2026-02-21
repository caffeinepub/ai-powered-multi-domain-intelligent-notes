import { useState } from 'react';
import { useGetUserQuizzes } from '../hooks/useQuizzes';
import QuizCard from '../components/QuizCard';
import QuizGenerationDialog from '../components/QuizGenerationDialog';
import { Button } from '@/components/ui/button';
import { Plus, Brain } from 'lucide-react';

export default function QuizzesPage() {
  const { data: quizzes, isLoading } = useGetUserQuizzes();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AI-Generated Quizzes</h1>
          <p className="text-muted-foreground">
            Test your knowledge with quizzes generated from your notes
          </p>
        </div>
        <Button
          onClick={() => setIsGenerateOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Quiz
        </Button>
      </div>

      {quizzes && quizzes.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">No quizzes yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Generate your first quiz from your notes to test your comprehension
          </p>
          <Button
            onClick={() => setIsGenerateOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Quiz
          </Button>
        </div>
      )}

      <QuizGenerationDialog open={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} />
    </div>
  );
}
