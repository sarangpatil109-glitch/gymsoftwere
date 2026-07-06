import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { dispatchAutomationEvent } from '@/services/automation';

// Secure the cron job (e.g. using Vercel Cron Secret)
// In production, verify the Authorization header matches process.env.CRON_SECRET
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // 1. Process Birthdays
    // Extract month and day from current date
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    // In Supabase, we can't easily query exact month/day from a string "YYYY-MM-DD" directly without PostgREST functions.
    // For simplicity, we fetch members and filter. In a large db, use an RPC or calculated column.
    const { data: members, error: membersError } = await supabase.from('members').select('*');
    
    if (members && !membersError) {
      for (const member of members) {
        if (!member.date_of_birth) continue;
        const dob = new Date(member.date_of_birth);
        
        // BIRTHDAYS
        if (dob.getMonth() + 1 === currentMonth && dob.getDate() === currentDay) {
          // Check if we already sent a birthday message today to avoid duplicates
          const { data: existingLog } = await supabase
            .from('automation_logs')
            .select('id')
            .eq('member_id', member.id)
            .eq('trigger_type', 'BIRTHDAY_TODAY')
            .gte('executed_at', `${todayStr}T00:00:00Z`)
            .limit(1);

          if (!existingLog || existingLog.length === 0) {
            await dispatchAutomationEvent('BIRTHDAY_TODAY', { memberId: member.id });
          }
        }

        // MEMBERSHIP EXPIRING
        if (member.expiry_date) {
          const expiryDate = new Date(member.expiry_date);
          const diffTime = expiryDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // E.g. exactly 7 days remaining. 
          // We fetch the rule condition to know the exact days, but for simplicity we can trigger for all and let the condition check it, 
          // or just trigger when it's exactly 7, 3, or 1 days based on the active rules.
          // For now, let's trigger the event and pass daysRemaining in context if we update dispatch logic.
          // A better way is:
          if (diffDays === 7 || diffDays === 3 || diffDays === 1) {
             const { data: existingLog } = await supabase
              .from('automation_logs')
              .select('id')
              .eq('member_id', member.id)
              .eq('trigger_type', 'MEMBERSHIP_EXPIRING')
              .gte('executed_at', `${todayStr}T00:00:00Z`)
              .limit(1);

            if (!existingLog || existingLog.length === 0) {
              await dispatchAutomationEvent('MEMBERSHIP_EXPIRING', { memberId: member.id });
            }
          }
        }

        // ATTENDANCE MISSING (Pseudo code - depends on attendance log table)
        // If no attendance in the last 5 days
        // const { data: recentAttendance } = await supabase.from('attendance').select('date').eq('member_id', member.id).order('date', { ascending: false }).limit(1);
        // if (!recentAttendance || Date.now() - new Date(recentAttendance[0].date).getTime() > 5 * 24 * 60 * 60 * 1000) {
        //   ... dispatch ATTENDANCE_MISSING
        // }
      }
    }

    return NextResponse.json({ success: true, message: 'Cron executed successfully' });
  } catch (error: any) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
