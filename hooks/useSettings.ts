import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { GymProfile, SystemPreferences, ReceiptSettings, ThemeSettings } from "@/types/settings";
import { toast } from "sonner";

// Gym Profile
export function useGymProfile() {
  return useQuery({
    queryKey: ["settings", "gym_profile"],
    queryFn: () => settingsService.getGymProfile(),
  });
}

export function useUpdateGymProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GymProfile) => settingsService.updateGymProfile(data),
    onSuccess: () => {
      toast.success("Gym Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings", "gym_profile"] });
    },
    onError: (err) => toast.error("Failed to update profile", { description: err.message }),
  });
}

// System Preferences
export function useSystemPreferences() {
  return useQuery({
    queryKey: ["settings", "system_preferences"],
    queryFn: () => settingsService.getSystemPreferences(),
  });
}

export function useUpdateSystemPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SystemPreferences) => settingsService.updateSystemPreferences(data),
    onSuccess: () => {
      toast.success("System preferences updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings", "system_preferences"] });
    },
    onError: (err) => toast.error("Failed to update preferences", { description: err.message }),
  });
}

// Receipt Settings
export function useReceiptSettings() {
  return useQuery({
    queryKey: ["settings", "receipt"],
    queryFn: () => settingsService.getReceiptSettings(),
  });
}

export function useUpdateReceiptSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ReceiptSettings>) => settingsService.updateReceiptSettings(data),
    onSuccess: () => {
      toast.success("Receipt settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings", "receipt"] });
    },
    onError: (err) => toast.error("Failed to update receipt settings", { description: err.message }),
  });
}

// Theme Settings
export function useThemeSettings() {
  return useQuery({
    queryKey: ["settings", "theme"],
    queryFn: () => settingsService.getThemeSettings(),
  });
}

export function useUpdateThemeSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ThemeSettings>) => settingsService.updateThemeSettings(data),
    onSuccess: () => {
      toast.success("Theme settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings", "theme"] });
    },
    onError: (err) => toast.error("Failed to update theme", { description: err.message }),
  });
}
