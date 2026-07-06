import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '@/services/progressService';
import { BodyMeasurementPayload, ProgressPhotoPayload } from '@/types/progress';
import { toast } from 'sonner';

// --- Body Measurements Hooks ---
export function useMemberMeasurements(memberId: string) {
  return useQuery({
    queryKey: ['measurements', memberId],
    queryFn: () => progressService.getMemberMeasurements(memberId),
    enabled: !!memberId,
  });
}

export function useAddMeasurement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BodyMeasurementPayload) => progressService.addMeasurement(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['measurements', variables.member_id] });
      toast.success('Measurement added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add measurement');
    },
  });
}

export function useDeleteMeasurement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string, memberId: string }) => progressService.deleteMeasurement(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['measurements', variables.memberId] });
      toast.success('Measurement deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete measurement');
    },
  });
}

// --- Progress Photos Hooks ---
export function useMemberPhotos(memberId: string) {
  return useQuery({
    queryKey: ['progressPhotos', memberId],
    queryFn: () => progressService.getMemberPhotos(memberId),
    enabled: !!memberId,
  });
}

export function useAddProgressPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      files
    }: {
      payload: Omit<ProgressPhotoPayload, 'front_url' | 'back_url' | 'left_url' | 'right_url'>;
      files: { front?: File, back?: File, left?: File, right?: File }
    }) => {
      const urls: any = {};
      
      // Upload each file that exists
      if (files.front) urls.front_url = await progressService.uploadPhotoFile(payload.member_id, files.front, 'front');
      if (files.back) urls.back_url = await progressService.uploadPhotoFile(payload.member_id, files.back, 'back');
      if (files.left) urls.left_url = await progressService.uploadPhotoFile(payload.member_id, files.left, 'left');
      if (files.right) urls.right_url = await progressService.uploadPhotoFile(payload.member_id, files.right, 'right');
      
      const finalPayload: ProgressPhotoPayload = { ...payload, ...urls };
      return progressService.addProgressPhoto(finalPayload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progressPhotos', variables.payload.member_id] });
      toast.success('Progress photos saved');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save progress photos');
    },
  });
}

export function useDeleteProgressPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string, memberId: string }) => progressService.deleteProgressPhoto(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progressPhotos', variables.memberId] });
      toast.success('Photo record deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete photo record');
    },
  });
}
