import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Quiz, Question } from '../backend';

export function useGetUserQuizzes() {
  const { actor, isFetching } = useActor();

  return useQuery<Quiz[]>({
    queryKey: ['userQuizzes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserQuizzes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuiz(quizId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Quiz | null>({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      if (!actor || !quizId) return null;
      return actor.getQuiz(quizId);
    },
    enabled: !!actor && !isFetching && !!quizId,
  });
}

export function useSaveQuiz() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, questions }: { title: string; questions: Question[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveQuiz(title, questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userQuizzes'] });
    },
  });
}
