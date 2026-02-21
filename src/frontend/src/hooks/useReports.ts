import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { MedicalReport, ExternalBlob, LegalAnalysis, Clause, Obligation, Right, Party, DateInfo } from '../backend';

export function useGetUserReports() {
  const { actor, isFetching } = useActor();

  return useQuery<MedicalReport[]>({
    queryKey: ['userReports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMedicalReport(reportId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MedicalReport | null>({
    queryKey: ['medicalReport', reportId],
    queryFn: async () => {
      if (!actor || !reportId) return null;
      return actor.getMedicalReport(reportId);
    },
    enabled: !!actor && !isFetching && !!reportId,
  });
}

export function useUploadMedicalReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      // Domain is automatically classified by backend
      return actor.uploadMedicalReport(file, 'general');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReports'] });
    },
  });
}

export function useSaveAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, analysis }: { reportId: string; analysis: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveAnalysis(reportId, analysis);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userReports'] });
      queryClient.invalidateQueries({ queryKey: ['medicalReport', variables.reportId] });
    },
  });
}

export function useGetLegalAnalysis(documentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<LegalAnalysis | null>({
    queryKey: ['legalAnalysis', documentId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getLegalAnalysis(documentId);
      } catch (error) {
        // Return null if analysis doesn't exist yet
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSaveLegalAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      clauses,
      obligations,
      rights,
      parties,
      dates,
      summary,
    }: {
      documentId: string;
      clauses: Clause[];
      obligations: Obligation[];
      rights: Right[];
      parties: Party[];
      dates: DateInfo[];
      summary: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveLegalAnalysis(documentId, clauses, obligations, rights, parties, dates, summary);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['legalAnalysis', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['userReports'] });
    },
  });
}
