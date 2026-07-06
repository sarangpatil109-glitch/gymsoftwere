"use client";
import React from 'react';

import { usePortalMemberBySlug, usePortalMembership, usePortalAttendance } from "@/hooks/useMemberPortal";
import { Settings, CreditCard, Award, CalendarDays, Phone, Mail, FileText, ChevronRight, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { logoutMember } from "../../login/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useUpdatePortalMember } from "@/hooks/useMemberPortal";

export default function MemberProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = React.use(props.params);
  const { slug } = params;
  const router = useRouter();
  
  const { data: member, isLoading: isMemberLoading } = usePortalMemberBySlug(slug);
  const memberId = member?.member_id || "";
  
  const { data: membership, isLoading: isMembershipLoading } = usePortalMembership(memberId);
  const { data: attendance } = usePortalAttendance(memberId);
  const { mutate: updateMember, isPending: isUpdating } = useUpdatePortalMember();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "", emergency_contact: "" });

  useEffect(() => {
    if (member) {
      setFormData({
        phone: member.phone || "",
        address: member.address || "",
        emergency_contact: member.emergency_contact || ""
      });
    }
  }, [member]);

  if (isMemberLoading || isMembershipLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  const handleLogout = async () => {
    await logoutMember();
    router.push("/member/login");
    toast.success("Logged out successfully");
  };

  const handleSave = () => {
    updateMember({ id: member.id, updates: formData }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const achievements = [
    { title: "First Visit", icon: "🎉", color: "bg-blue-100 text-blue-600", active: (attendance?.length || 0) > 0 },
    { title: "10 Visits", icon: "🔥", color: "bg-orange-100 text-orange-600", active: (attendance?.length || 0) >= 10 },
    { title: "50 Visits", icon: "💯", color: "bg-amber-100 text-amber-600", active: (attendance?.length || 0) >= 50 },
    { title: "Gold Member", icon: "⭐", color: "bg-yellow-100 text-yellow-600", active: membership?.plan?.name?.toLowerCase().includes("gold") },
  ].filter(a => a.active);

  return (
    <div className="space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 text-center relative overflow-hidden shadow-sm">
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="absolute top-4 right-4 h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Save className="h-4 w-4 text-blue-600" /> : <Settings className="h-4 w-4" />}
        </button>
        
        <div className="h-24 w-24 mx-auto rounded-full bg-blue-50 dark:bg-blue-900/30 mb-3 border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden relative">
          <img src={member?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${memberId}`} alt="Avatar" className="h-full w-full object-cover" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{member?.first_name} {member?.last_name}</h2>
        <p className="text-sm text-slate-500">ID: {member?.member_id}</p>
        
        <div className="flex justify-center gap-2 mt-4">
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-800">
            {membership?.plan?.name || "No Active Plan"}
          </span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${membership?.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
            {membership?.status || "INACTIVE"}
          </span>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 px-1 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" /> Achievements
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {achievements.map((badge, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center shrink-0 w-24 snap-start shadow-sm">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl mb-2 ${badge.color}`}>
                  {badge.icon}
                </div>
                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 text-center leading-tight">{badge.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Options */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          
          <li className="active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors">
            <Link href="#" className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">Membership & Payments</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {membership?.end_date ? `Renews on ${format(parseISO(membership.end_date), 'MMM d, yyyy')}` : "No active membership"}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </Link>
          </li>
          
          <li className="active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors">
            <Link href="#" className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">Attendance History</h4>
                <p className="text-xs text-slate-500 mt-0.5">{attendance?.length || 0} total visits</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </Link>
          </li>
          
        </ul>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Contact Details</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm">
            <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white" 
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 font-medium">{member?.phone || "Not set"}</p>
              )}
              <p className="text-slate-500 text-xs">Primary Mobile</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-sm">
            <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-slate-900 dark:text-slate-100 font-medium">{member?.email || "Not set"}</p>
              <p className="text-slate-500 text-xs">Email (Read Only)</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white" 
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 font-medium">{member?.emergency_contact || "Not set"}</p>
              )}
              <p className="text-slate-500 text-xs">Emergency Contact</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-2xl active:scale-[0.98] transition-all border border-red-100 dark:border-red-900/30"
      >
        Log Out
      </button>

    </div>
  );
}



