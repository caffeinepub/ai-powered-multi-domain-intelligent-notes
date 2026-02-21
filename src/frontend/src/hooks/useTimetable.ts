import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { TimetableEntry } from '../backend';

export function useGetUserTimetableEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<TimetableEntry[]>({
    queryKey: ['userTimetableEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTimetableEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTimetableEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entryType,
      title,
      startTime,
      endTime,
      location,
      recurring,
    }: {
      entryType: string;
      title: string;
      startTime: string;
      endTime: string;
      location: string;
      recurring: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTimetableEntry(entryType, title, startTime, endTime, location, recurring);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTimetableEntries'] });
    },
  });
}

export function useDeleteTimetableEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTimetableEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTimetableEntries'] });
    },
  });
}
