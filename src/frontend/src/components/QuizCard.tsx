import { useState } from 'react';
import { Quiz } from '../backend';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuizTaker from './QuizTaker';

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Card className="hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200/50 dark:border-gray-700/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                {quiz.title}
              </CardTitle>
            </div>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              {quiz.questions.length} Q's
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Created {formatDate(quiz.creationTimestamp)}
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t border-amber-200/50 dark:border-gray-700/50">
          <Button
            onClick={() => setIsTakingQuiz(true)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Quiz
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isTakingQuiz} onOpenChange={setIsTakingQuiz}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{quiz.title}</DialogTitle>
          </DialogHeader>
          <QuizTaker quiz={quiz} onClose={() => setIsTakingQuiz(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
