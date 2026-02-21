import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RevisionReminder } from '../backend';

export function useGetUserReminders() {
  const { actor, isFetching } = useActor();

  return useQuery<RevisionReminder[]>({
    queryKey: ['userReminders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserReminders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRevisionReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      topic,
      timesRevised,
      nextRevision,
    }: {
      topic: string;
      timesRevised: bigint;
      nextRevision: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRevisionReminder(topic, timesRevised, nextRevision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReminders'] });
    },
  });
}

export function useUpdateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reminderId,
      timesRevised,
      nextRevision,
    }: {
      reminderId: bigint;
      timesRevised: bigint;
      nextRevision: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReminder(reminderId, timesRevised, nextRevision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReminders'] });
    },
  });
}

export function useDeactivateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deactivateReminder(reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReminders'] });
    },
  });
}
