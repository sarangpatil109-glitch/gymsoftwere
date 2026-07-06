import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainerPanelService } from '@/services/trainerPanelService';
import { toast } from 'sonner';

export function useTrainers() {
  return useQuery({
    queryKey: ['trainers'],
    queryFn: () => trainerPanelService.getTrainers(),
  });
}

export function useAssignedMembers(trainerId?: string) {
  return useQuery({
    queryKey: ['trainerAssignments', trainerId],
    queryFn: () => trainerPanelService.getAssignedMembers(trainerId!),
    enabled: !!trainerId,
  });
}

export function useTrainerDashboardStats(trainerId?: string) {
  return useQuery({
    queryKey: ['trainerDashboardStats', trainerId],
    queryFn: () => trainerPanelService.getDashboardStats(trainerId!),
    enabled: !!trainerId,
  });
}

export function useAssignMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ trainerId, memberId, notes }: { trainerId: string, memberId: string, notes?: string }) => 
      trainerPanelService.assignMember(trainerId, memberId, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trainerAssignments', variables.trainerId] });
      queryClient.invalidateQueries({ queryKey: ['trainerDashboardStats', variables.trainerId] });
      toast.success('Member assigned to trainer');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign member');
    },
  });
}

export function useRemoveAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, trainerId }: { assignmentId: string, trainerId: string }) => 
      trainerPanelService.removeAssignment(assignmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trainerAssignments', variables.trainerId] });
      queryClient.invalidateQueries({ queryKey: ['trainerDashboardStats', variables.trainerId] });
      toast.success('Assignment removed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove assignment');
    },
  });
}
