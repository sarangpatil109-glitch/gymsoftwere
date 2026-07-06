export interface GymProfile {
  gymName: string;
  ownerName?: string;
  mobile?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  timezone?: string;
  currency?: string;
  businessHours?: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface SystemPreferences {
  dateFormat: string;
  currencySymbol: string;
  weightUnit: "Kg" | "Lb";
  heightUnit: "Cm" | "Ft";
  timeFormat: "12 Hour" | "24 Hour";
  language: "English";
}

export interface SettingsRow {
  id: string;
  category: string;
  key: string;
  value: Record<string, unknown>;
}

export interface MembershipPlan {
  id: string;
  planName: string;
  duration: string; // Monthly, Quarterly, Half Yearly, Yearly
  price: number;
  discount: number;
  finalPrice: number;
  description?: string;
  color: string;
  displayOrder: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface Trainer {
  id: string;
  photoUrl?: string;
  fullName: string;
  phone: string;
  email?: string;
  specialization?: string;
  experienceYears: number;
  joiningDate: string;
  status: "Active" | "Inactive";
}

export interface PaymentMethod {
  id: string;
  methodName: string;
  isEnabled: boolean;
  displayOrder: number;
}

export interface ReceiptSettings {
  id: string;
  receiptHeader?: string;
  receiptFooter?: string;
  authorizedSignatureText: string;
  gstNumber?: string;
  receiptPrefix: string;
  receiptStartingNumber: number;
  logoPosition: "Left" | "Center" | "Right";
  printSize: "A4" | "Thermal 80mm" | "Thermal 58mm";
  autoReceiptNumber: boolean;
}

export interface ThemeSettings {
  id: string;
  primaryColor: string;
  sidebarColor: string;
  darkMode: boolean;
  gymLogoUrl?: string;
  faviconUrl?: string;
  softwareTitle: string;
}
