export type AutomationTriggerType =
  | 'MEMBER_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'BIRTHDAY_TODAY'
  | 'MEMBERSHIP_EXPIRING'
  | 'ATTENDANCE_MISSING'
  | 'WORKOUT_ASSIGNED'
  | 'DIET_ASSIGNED';

export type AutomationActionType = 'SEND_TEMPLATE';

export type AutomationJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type AutomationJobType = 'WHATSAPP' | 'EMAIL' | 'SMS' | 'PUSH';

export type AutomationLogStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED';

export interface AutomationTemplate {
  id: string;
  name: string;
  type: string;
  subject?: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger_type: AutomationTriggerType;
  condition_details: Record<string, any>;
  action_type: AutomationActionType;
  template_id: string | null;
  is_active: boolean;
  last_executed_at?: string | null;
  execution_count: number;
  created_at?: string;
  updated_at?: string;
  
  // Joined relation
  template?: AutomationTemplate;
}

export interface AutomationJob {
  id: string;
  rule_id: string;
  member_id: string;
  job_type: AutomationJobType;
  payload: Record<string, any>;
  status: AutomationJobStatus;
  scheduled_for: string;
  processed_at?: string | null;
  error_message?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AutomationLog {
  id: string;
  rule_id: string;
  member_id: string;
  trigger_type: AutomationTriggerType;
  status: AutomationLogStatus;
  message?: string;
  executed_at?: string;
  
  // Joined relation
  rule?: AutomationRule;
}
