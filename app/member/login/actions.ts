"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function loginMember(email: string) {
  if (!email) {
    return { error: "Email is required" };
  }

  // Look up member by email
  const { data: member, error } = await supabase
    .from("members")
    .select("id, member_id, member_slug")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (error || !member) {
    return { error: "No member found with this email." };
  }

  // Set secure HTTP-only cookie to identify the member session
  const cookieStore = await cookies();
  cookieStore.set("gymos_member_session", member.member_id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return { success: true, memberId: member.member_id, memberSlug: member.member_slug };
}

export async function logoutMember() {
  const cookieStore = await cookies();
  cookieStore.delete("gymos_member_session");
  return { success: true };
}
