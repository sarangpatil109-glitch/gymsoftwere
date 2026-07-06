"use client";

import { usePortalMemberBySlug, usePortalWorkout, useCompleteExercise } from "@/hooks/useMemberPortal";
import { PlayCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useState, use } from "react";

export default function MemberWorkoutPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const { slug } = params;
  const { data: member } = usePortalMemberBySlug(slug);
  const memberId = member?.member_id || "";
  const { data: workout, isLoading } = usePortalWorkout(memberId);
  const { mutate: completeExercise } = useCompleteExercise();
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">No Workout Assigned</h3>
        <p className="text-sm text-slate-500 mt-2">Your trainer hasn't assigned a workout yet. Take a rest day!</p>
      </div>
    );
  }

  const handleComplete = (exerciseId: string) => {
    setCompletedExercises(prev => ({ ...prev, [exerciseId]: true }));
    completeExercise({ exerciseId, completed: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{workout.name}</h2>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <Clock className="h-4 w-4" /> {workout.notes || "Assigned Workout"} • {workout.exercises.length} Exercises
        </p>
      </div>

      <div className="space-y-4">
        {workout.exercises.map((exItem: any) => {
          const ex = exItem.exercise;
          const isCompleted = completedExercises[exItem.id];
          
          return (
            <div key={exItem.id} className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-sm transition-all ${isCompleted ? 'border-emerald-200 dark:border-emerald-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
              <div className="flex p-3 gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                  {ex?.video_url ? (
                    <img src={`https://img.youtube.com/vi/${ex.video_url.split('v=')[1]?.split('&')[0] || ''}/0.jpg`} alt={ex.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=150&auto=format&fit=crop'; }} />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs text-center p-1">No Video</div>
                  )}
                  {ex?.video_url && (
                    <a href={ex.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors">
                      <PlayCircle className="h-8 w-8 text-white opacity-80" />
                    </a>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate pr-2">{ex?.name || "Unknown Exercise"}</h3>
                    {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                      {exItem.sets} Sets
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                      {exItem.reps} Reps
                    </span>
                    {exItem.weight && (
                      <span className="text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                        {exItem.weight}
                      </span>
                    )}
                    {exItem.rest_seconds && (
                      <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                        {exItem.rest_seconds}s Rest
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {exItem.notes && (
                <div className="px-3 pb-3 pt-1">
                  <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 border-dashed">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Trainer Note: </span>
                    {exItem.notes}
                  </p>
                </div>
              )}
              
              {!isCompleted && (
                <div className="px-3 pb-3">
                  <button 
                    onClick={() => handleComplete(exItem.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors active:scale-[0.98]"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4">
        <button className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-all">
          Finish Workout
        </button>
      </div>
    </div>
  );
}
