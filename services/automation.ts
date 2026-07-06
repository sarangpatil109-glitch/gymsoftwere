import { supabase } from "@/lib/supabase";
import { Member } from "@/types/member";
import { AutomationTriggerType, AutomationRule, AutomationTemplate } from "@/types/automation";

interface AutomationContext {
  memberId: string;
  paymentId?: string;
  workoutId?: string;
  dietId?: string;
  trainerName?: string;
  gymName?: string;
  receiptLink?: string;
}

export async function dispatchAutomationEvent(
  triggerType: AutomationTriggerType,
  context: AutomationContext
) {
  try {
    // 1. Fetch active rules for this trigger
    const { data: rulesData, error: rulesError } = await supabase
      .from("automation_rules")
      .select("*, template:automation_templates(*)")
      .eq("trigger_type", triggerType)
      .eq("is_active", true);

    if (rulesError || !rulesData || rulesData.length === 0) {
      return; // No active rules for this trigger
    }
    
    const rules = rulesData as any[]; // casting to avoid strict type issues with joins

    // 2. Fetch member details
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("*")
      .eq("id", context.memberId)
      .single();

    if (memberError || !memberData) {
      console.error("Failed to fetch member for automation", context.memberId);
      return;
    }
    const member = memberData as Member;

    // Default gym name if not provided
    let gymName = context.gymName;
    if (!gymName) {
      const { data: settings } = await supabase.from("settings_gym_profile").select("gym_name").single();
      gymName = settings?.gym_name || "GymOS";
    }

    // Portal Link
    const portalLink = typeof window !== 'undefined' ? `${window.location.origin}/member/${member.memberSlug}` : `/member/${member.memberSlug}`;

    // 3. Process each rule
    for (const rule of rules) {
      const template = rule.template;
      if (!template || !template.content) continue;

      // Condition checking (basic)
      // E.g., Membership expiring 7 days
      if (triggerType === 'MEMBERSHIP_EXPIRING' && rule.condition_details?.days_remaining) {
        // Cron handles this normally, but if triggered manually we could check here.
      }

      // Replace placeholders
      let content = template.content;
      content = content.replace(/{{member_name}}/g, member.fullName);
      content = content.replace(/{{membership_plan}}/g, member.membershipType || "Plan");
      content = content.replace(/{{expiry_date}}/g, member.expiryDate || "N/A");
      content = content.replace(/{{gym_name}}/g, gymName);
      content = content.replace(/{{trainer_name}}/g, context.trainerName || "Your Trainer");
      content = content.replace(/{{portal_link}}/g, portalLink);
      content = content.replace(/{{receipt_link}}/g, context.receiptLink || portalLink);

      const payload = {
        subject: template.subject,
        body: content,
        recipient_phone: member.whatsappNumber || member.mobileNumber,
        recipient_email: member.email,
        template_id: template.id,
      };

      // By default, we queue a WHATSAPP job. This could be configurable in the rule later.
      const jobType = "WHATSAPP";

      // Insert Job
      const { error: jobError } = await supabase.from("automation_jobs").insert({
        rule_id: rule.id,
        member_id: member.id,
        job_type: jobType,
        payload: payload,
        status: "PENDING",
        scheduled_for: new Date().toISOString()
      });

      // Insert Log
      await supabase.from("automation_logs").insert({
        rule_id: rule.id,
        member_id: member.id,
        trigger_type: triggerType,
        status: jobError ? "FAILED" : "SUCCESS",
        message: jobError ? jobError.message : `Job queued for ${jobType}`,
      });

      // Update Execution Count & Last Executed At
      if (!jobError) {
        await supabase
          .from("automation_rules")
          .update({
            execution_count: (rule.execution_count || 0) + 1,
            last_executed_at: new Date().toISOString()
          })
          .eq("id", rule.id);
      }
    }
  } catch (error) {
    console.error("Automation Dispatch Error:", error);
  }
}
