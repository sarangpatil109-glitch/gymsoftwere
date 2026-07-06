import { ReactNode } from "react";
import { MemberHeader } from "@/components/member/MemberHeader";
import { BottomNavigation } from "@/components/member/BottomNavigation";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";
import { MemberRealtimeSync } from "@/components/member/MemberRealtimeSync";

import { DEMO_MEMBER, DEMO_MEMBERSHIP } from "@/utils/demoMemberData";

export default async function MemberPortalLayout(
  props: { children: ReactNode; params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const { slug } = params;
  
  if (!slug) {
    notFound();
  }

  // Fetch basic member data for the header AND security validation
  let { data: member, error } = await supabase
    .from("members")
    .select("id, member_id, first_name, last_name")
    .or(`member_slug.eq.${slug},member_id.eq.${slug}`)
    .single();

  const isDev = process.env.NODE_ENV === "development";
  // Allow demo fallback for specific test users in production too, or generally if DB fails on preview
  const demoSlugs = ['sarang-patil', 'john-doe', 'demo-user', DEMO_MEMBER.member_id];
  const isDemoRequest = isDev || demoSlugs.includes(slug);
  
  let isDemoData = false;

  if ((error || !member) && isDemoRequest) {
    member = {
      id: "demo-uuid",
      member_id: DEMO_MEMBER.member_id,
      first_name: DEMO_MEMBER.first_name,
      last_name: DEMO_MEMBER.last_name
    } as any;
    isDemoData = true;
    error = null;
  }
  
  if (!member || (error && !isDemoData)) {
    notFound();
  }
  
  const memberId = member.member_id;

  // 1. Security Check: Validate session cookie
  const cookieStore = await cookies();
  const sessionMemberId = cookieStore.get("gymos_member_session")?.value;

  if (!isDemoData) {
    if (!sessionMemberId || sessionMemberId !== memberId) {
      // If no session or trying to access someone else's portal, redirect to login
      redirect("/member/login");
    }
  }

  // Fetch active membership to calculate days remaining
  let membership: any = null;
  
  if (isDemoData) {
    membership = DEMO_MEMBERSHIP;
  } else {
    const { data } = await supabase
      .from("memberships")
      .select("end_date")
      .eq("member_id", memberId)
      .eq("status", "ACTIVE")
      .single();
    membership = data;
  }

  const name = `${member.first_name} ${member.last_name}`;
  const daysRemaining = membership?.end_date 
    ? Math.max(0, differenceInDays(parseISO(membership.end_date), new Date()))
    : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 font-sans selection:bg-blue-200">
      <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-950 shadow-2xl overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.2)]">
        <MemberRealtimeSync memberId={memberId} memberUuid={member.id} />
        <MemberHeader 
          memberId={memberId} 
          name={name} 
          daysRemaining={daysRemaining} 
        />
        
        <main className="w-full relative z-10 p-4 animate-in fade-in duration-500 pb-24">
          {props.children}
        </main>
        
        <BottomNavigation slug={slug} />
      </div>
    </div>
  );
}
