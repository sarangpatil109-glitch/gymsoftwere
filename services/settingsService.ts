import { supabase } from "@/lib/supabase";
import { GymProfile, SystemPreferences, ReceiptSettings, ThemeSettings } from "@/types/settings";

export const settingsService = {
  // Gym Profile
  async getGymProfile(): Promise<GymProfile> {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("category", "gym_profile")
      .eq("key", "profile")
      .single();

    if (error || !data) {
      return {
        gymName: "GymOS",
        ownerName: "",
        mobile: "",
        email: "",
        website: "",
        gstNumber: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        timezone: "Asia/Kolkata",
        currency: "INR",
        businessHours: "",
        socialMedia: {}
      };
    }
    return data.value as GymProfile;
  },

  async updateGymProfile(profile: GymProfile): Promise<void> {
    const { error } = await supabase
      .from("settings")
      .upsert({
        category: "gym_profile",
        key: "profile",
        value: profile as unknown as Record<string, unknown>
      }, { onConflict: 'key' });

    if (error) throw new Error(error.message);
  },

  // System Preferences
  async getSystemPreferences(): Promise<SystemPreferences> {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("category", "system_preferences")
      .eq("key", "preferences")
      .single();

    if (error || !data) {
      return {
        dateFormat: "DD/MM/YYYY",
        currencySymbol: "₹",
        weightUnit: "Kg",
        heightUnit: "Cm",
        timeFormat: "12 Hour",
        language: "English"
      };
    }
    return data.value as SystemPreferences;
  },

  async updateSystemPreferences(prefs: SystemPreferences): Promise<void> {
    const { error } = await supabase
      .from("settings")
      .upsert({
        category: "system_preferences",
        key: "preferences",
        value: prefs as unknown as Record<string, unknown>
      }, { onConflict: 'key' });

    if (error) throw new Error(error.message);
  },

  // Receipt Settings
  async getReceiptSettings(): Promise<ReceiptSettings> {
    const { data, error } = await supabase
      .from("receipt_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return {
        id: "",
        receiptHeader: "Welcome to GymOS",
        receiptFooter: "Thank you for your payment!",
        authorizedSignatureText: "Authorized Signature",
        receiptPrefix: "PAY",
        receiptStartingNumber: 1,
        logoPosition: "Left",
        printSize: "A4",
        autoReceiptNumber: true
      };
    }

    return {
      id: data.id,
      receiptHeader: data.receipt_header,
      receiptFooter: data.receipt_footer,
      authorizedSignatureText: data.authorized_signature_text,
      gstNumber: data.gst_number,
      receiptPrefix: data.receipt_prefix,
      receiptStartingNumber: data.receipt_starting_number,
      logoPosition: data.logo_position,
      printSize: data.print_size,
      autoReceiptNumber: data.auto_receipt_number,
    };
  },

  async updateReceiptSettings(settings: Partial<ReceiptSettings>): Promise<void> {
    const dbData = {
      receipt_header: settings.receiptHeader,
      receipt_footer: settings.receiptFooter,
      authorized_signature_text: settings.authorizedSignatureText,
      gst_number: settings.gstNumber,
      receipt_prefix: settings.receiptPrefix,
      receipt_starting_number: settings.receiptStartingNumber,
      logo_position: settings.logoPosition,
      print_size: settings.printSize,
      auto_receipt_number: settings.autoReceiptNumber,
    };

    if (settings.id) {
      const { error } = await supabase.from("receipt_settings").update(dbData).eq("id", settings.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("receipt_settings").insert([dbData]);
      if (error) throw new Error(error.message);
    }
  },

  // Theme Settings
  async getThemeSettings(): Promise<ThemeSettings> {
    const { data, error } = await supabase
      .from("theme_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return {
        id: "",
        primaryColor: "#3b82f6",
        sidebarColor: "#1e293b",
        darkMode: false,
        softwareTitle: "GymOS"
      };
    }

    return {
      id: data.id,
      primaryColor: data.primary_color,
      sidebarColor: data.sidebar_color,
      darkMode: data.dark_mode,
      gymLogoUrl: data.gym_logo_url,
      faviconUrl: data.favicon_url,
      softwareTitle: data.software_title,
    };
  },

  async updateThemeSettings(settings: Partial<ThemeSettings>): Promise<void> {
    const dbData = {
      primary_color: settings.primaryColor,
      sidebar_color: settings.sidebarColor,
      dark_mode: settings.darkMode,
      software_title: settings.softwareTitle,
    };

    if (settings.id) {
      const { error } = await supabase.from("theme_settings").update(dbData).eq("id", settings.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("theme_settings").insert([dbData]);
      if (error) throw new Error(error.message);
    }
  },
  
  async uploadGymLogo(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `gym_logo_${Math.random()}.${fileExt}`;
    const filePath = `settings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};
