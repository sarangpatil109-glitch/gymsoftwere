import { supabase } from "@/lib/supabase";
import { WhatsAppTemplate, WhatsAppLog, AutomationRule, SendWhatsAppMessagePayload } from "@/types/whatsapp";

export const whatsappService = {
  // Templates
  async getTemplates(): Promise<WhatsAppTemplate[]> {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createTemplate(template: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .insert(template)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateTemplate(id: string, template: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTemplate(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('whatsapp_templates')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Automation Rules
  async getAutomationRules(): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('automation_rules')
      .select(`
        *,
        template:whatsapp_templates(*)
      `)
      .order('event_type', { ascending: true });
    if (error) throw error;
    return data;
  },

  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const { data, error } = await supabase
      .from('automation_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Logs
  async getLogs(): Promise<WhatsAppLog[]> {
    const { data, error } = await supabase
      .from('whatsapp_logs')
      .select(`
        *,
        template:whatsapp_templates(*)
      `)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data;
  },

  // Mock Meta API Sending
  async sendMockMessage(payload: SendWhatsAppMessagePayload): Promise<WhatsAppLog> {
    // 1. Fetch template
    const { data: template, error: templateError } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .eq('id', payload.templateId)
      .single();
    
    if (templateError) throw templateError;

    // 2. Render message content
    let renderedContent = template.content;
    if (payload.variables) {
      Object.keys(payload.variables).forEach(key => {
        renderedContent = renderedContent.replace(`{{${key}}}`, payload.variables[key]);
      });
    }

    // 3. Simulate Meta API call (random success/fail)
    const isSuccess = Math.random() > 0.15; // 85% success rate for simulation

    // 4. Log the message
    const { data: log, error: logError } = await supabase
      .from('whatsapp_logs')
      .insert({
        member_id: payload.memberId,
        phone_number: payload.phoneNumber,
        template_id: payload.templateId,
        message_content: renderedContent,
        status: isSuccess ? 'SENT' : 'FAILED',
        error_message: isSuccess ? null : 'Meta API Error: Rate limit exceeded (Simulated)',
        sent_at: isSuccess ? new Date().toISOString() : null,
      })
      .select()
      .single();
    
    if (logError) throw logError;

    // 5. If success, simulate delivery and read receipts after a delay (async)
    if (isSuccess) {
      setTimeout(async () => {
        await supabase.from('whatsapp_logs').update({ status: 'DELIVERED', delivered_at: new Date().toISOString() }).eq('id', log.id);
        
        // 50% chance they read it quickly
        if (Math.random() > 0.5) {
          setTimeout(async () => {
            await supabase.from('whatsapp_logs').update({ status: 'READ', read_at: new Date().toISOString() }).eq('id', log.id);
          }, 3000); // 3 seconds later
        }
      }, 2000); // 2 seconds later
    }

    return log;
  },

  // Retry Failed Messages
  async retryFailedMessage(logId: string): Promise<WhatsAppLog> {
    const { data: log, error } = await supabase
      .from('whatsapp_logs')
      .select('*')
      .eq('id', logId)
      .single();
    
    if (error) throw error;
    if (log.status !== 'FAILED') throw new Error("Only failed messages can be retried.");

    // Update to pending
    await supabase.from('whatsapp_logs').update({ status: 'PENDING', error_message: null }).eq('id', logId);

    // Simulate sending again
    return await this.sendMockMessage({
      memberId: log.member_id,
      phoneNumber: log.phone_number,
      templateId: log.template_id,
      variables: {}, // We would normally need to re-derive variables, but for mock retry we'll just resend content
    });
  }
};
