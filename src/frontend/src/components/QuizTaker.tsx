import { useState } from 'react';
import { Quiz } from '../backend';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface QuizTakerProps {
  quiz: Quiz;
  onClose: () => void;
}

export default function QuizTaker({ quiz, onClose }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(quiz.questions.length).fill(''));
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl text-muted-foreground mb-6">
            You scored {score} out of {quiz.questions.length}
          </p>
          <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-8">
            {percentage}%
          </div>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, idx) => {
            const isCorrect = selectedAnswers[idx] === q.correctAnswer;
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">{q.questionText}</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Your answer: </span>
                      <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {selectedAnswers[idx] || 'Not answered'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Correct answer: </span>
                        <span className="text-green-600 dark:text-green-400">{q.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={onClose} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.questionText}</h3>
        <RadioGroup value={selectedAnswers[currentQuestionIndex]} onValueChange={handleAnswerSelect}>
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-border hover:border-amber-400 transition-colors">
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
        >
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
