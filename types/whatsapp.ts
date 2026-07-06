export type WhatsAppTemplateStatus = "APPROVED" | "PENDING" | "REJECTED";
export type WhatsAppLogStatus = "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";
export type WhatsAppTemplateCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: WhatsAppTemplateCategory;
  language: string;
  content: string;
  variables: string[]; // array of strings, e.g., ["Member Name", "Date"]
  status: WhatsAppTemplateStatus;
  created_at?: string;
  updated_at?: string;
}

export interface AutomationRule {
  id: string;
  event_type: string;
  template_id: string | null;
  is_active: boolean;
  delay_minutes: number;
  created_at?: string;
  updated_at?: string;
  template?: WhatsAppTemplate;
}

export interface WhatsAppLog {
  id: string;
  member_id: string;
  phone_number: string;
  template_id: string | null;
  message_content: string;
  status: WhatsAppLogStatus;
  error_message?: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  created_at?: string;
  updated_at?: string;
  template?: WhatsAppTemplate;
}

export interface SendWhatsAppMessagePayload {
  memberId: string;
  phoneNumber: string;
  templateId: string;
  variables: Record<string, string>; // e.g. { "1": "John Doe", "2": "Jan 1, 2026" }
}
