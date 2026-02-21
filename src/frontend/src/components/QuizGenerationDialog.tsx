import { useState } from 'react';
import { useSaveQuiz } from '../hooks/useQuizzes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { Question } from '../backend';

interface QuizGenerationDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function QuizGenerationDialog({ open, onClose }: QuizGenerationDialogProps) {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const saveQuizMutation = useSaveQuiz();

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    setIsGenerating(true);

    // Simulate AI quiz generation
    const sampleQuestions: Question[] = [
      {
        questionText: 'What is the primary function of the cardiovascular system?',
        options: [
          'To transport oxygen and nutrients',
          'To digest food',
          'To filter waste',
          'To produce hormones',
        ],
        correctAnswer: 'To transport oxygen and nutrients',
      },
      {
        questionText: 'Which organ is responsible for filtering blood?',
        options: ['Heart', 'Liver', 'Kidneys', 'Lungs'],
        correctAnswer: 'Kidneys',
      },
      {
        questionText: 'What is the normal resting heart rate for adults?',
        options: ['40-60 bpm', '60-100 bpm', '100-120 bpm', '120-140 bpm'],
        correctAnswer: '60-100 bpm',
      },
    ];

    try {
      await saveQuizMutation.mutateAsync({ title, questions: sampleQuestions });
      toast.success('Quiz generated successfully');
      setTitle('');
      onClose();
    } catch (error) {
      toast.error('Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Generate AI Quiz
          </DialogTitle>
          <DialogDescription>
            Create a quiz from your notes and documents using AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-purple-800 dark:text-purple-200">
              Our AI will analyze your notes and generate relevant questions to test your comprehension
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Medical Terminology Quiz"
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
