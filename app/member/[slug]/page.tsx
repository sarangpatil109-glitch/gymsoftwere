"use client";

import { usePortalMemberBySlug, usePortalAttendance, usePortalWorkout, usePortalDiet, usePortalProgress } from "@/hooks/useMemberPortal";
import { Dumbbell, Apple, Droplet, MessageCircle, Ruler, Activity, Loader2 } from "lucide-react";
import Link from "next/link";

import { use } from "react";

export default function MemberHomePage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const { slug } = params;
  
  const { data: member, isLoading: isMemberLoading } = usePortalMemberBySlug(slug);
  const memberId = member?.member_id || "";
  
  const { data: attendance, isLoading: isAttendanceLoading } = usePortalAttendance(memberId);
  const { data: workout, isLoading: isWorkoutLoading } = usePortalWorkout(memberId);
  const { data: diet, isLoading: isDietLoading } = usePortalDiet(memberId);
  const { data: progress, isLoading: isProgressLoading } = usePortalProgress(memberId);

  if (isMemberLoading || isAttendanceLoading || isWorkoutLoading || isDietLoading || isProgressLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  // Calculate stats
  const latestProgress = progress && progress.length > 0 ? progress[progress.length - 1] : null;
  const currentWeight = latestProgress?.weight || 0;
  
  // Calculate attendance % for the last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
  const recentAttendance = attendance?.filter(a => new Date(a.check_in) >= thirtyDaysAgo) || [];
  // Assuming 20 working days in a month for 100% attendance
  const attendancePercentage = Math.min(100, Math.round((recentAttendance.length / 20) * 100));
  
  // Workout details
  const totalExercises = workout?.exercises?.length || 0;
  const totalDietCalories = diet?.meals?.reduce((sum: number, m: any) => sum + (m.calories || 0), 0) || 0;
  const totalDietProtein = diet?.meals?.reduce((sum: number, m: any) => sum + (m.protein || 0), 0) || 0;

  return (
    <div className="space-y-6">
      
      {/* Welcome & Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Weight</p>
            <h3 className="text-3xl font-bold">{currentWeight > 0 ? currentWeight : '--'} <span className="text-sm font-normal text-blue-200">kg</span></h3>
            <p className="text-xs text-blue-100 mt-2 flex items-center">
              Current Logged Weight
            </p>
          </div>
          <Activity className="absolute -bottom-4 -right-4 h-24 w-24 text-white opacity-10" />
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Attendance</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{attendancePercentage}<span className="text-sm font-normal text-slate-400">%</span></h3>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${attendancePercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 px-1">Today's Schedule</h3>
        <div className="space-y-3">
          
          <Link href={`/member/${slug}/workout`} className="block">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{workout ? workout.name : 'No Workout Assigned'}</h4>
                {workout && <p className="text-sm text-slate-500">{totalExercises} Exercises</p>}
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <span className="text-xl leading-none -mt-0.5">›</span>
              </div>
            </div>
          </Link>
          
          <Link href={`/member/${slug}/diet`} className="block">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <Apple className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{diet ? diet.name : 'No Diet Assigned'}</h4>
                {diet && <p className="text-sm text-slate-500">{totalDietCalories} kcal • {totalDietProtein}g Protein</p>}
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <span className="text-xl leading-none -mt-0.5">›</span>
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* Habits & Quick Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center active:scale-[0.98] transition-all cursor-pointer">
          <div className="h-10 w-10 mx-auto rounded-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-500 mb-2">
            <Droplet className="h-5 w-5" />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">Daily Goal</h4>
          <p className="text-[10px] text-slate-500">Water Tracking</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center active:scale-[0.98] transition-all cursor-pointer">
          <div className="h-10 w-10 mx-auto rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mb-2">
            <Ruler className="h-5 w-5" />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">Log Now</h4>
          <p className="text-[10px] text-slate-500">Add Measurement</p>
        </div>
      </div>

      {/* Trainer Message */}
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-4 relative overflow-hidden">
        <MessageCircle className="absolute -right-4 -bottom-4 h-20 w-20 text-indigo-500 opacity-5" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Trainer" alt="Trainer" className="h-full w-full object-cover bg-indigo-100" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Your Dashboard</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              "Welcome back! Check out your assigned workouts and log your progress to stay on track."
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
