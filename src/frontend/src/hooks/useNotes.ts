import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Note } from '../backend';

export function useGetUserNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['userNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNote(noteId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Note | null>({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!actor || !noteId) return null;
      return actor.getNote(noteId);
    },
    enabled: !!actor && !isFetching && !!noteId,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Domain is automatically classified by backend
      return actor.createNote(title, content, 'general');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotes'] });
    },
  });
}

export function useEditNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, title, content }: { noteId: string; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editNote(noteId, title, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userNotes'] });
      queryClient.invalidateQueries({ queryKey: ['note', variables.noteId] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNote(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotes'] });
    },
  });
}
