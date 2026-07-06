"use client";
import React from 'react';

import { usePortalMemberBySlug, usePortalDiet } from "@/hooks/useMemberPortal";
import { Flame, Droplet, Coffee, Utensils, Apple as AppleIcon, Moon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MemberDietPage(props: { params: Promise<{ slug: string }> }) {
  const params = React.use(props.params);
  const { slug } = params;
  const { data: member } = usePortalMemberBySlug(slug);
  const memberId = member?.member_id || "";
  const { data: diet, isLoading } = usePortalDiet(memberId);
  const [loggedMeals, setLoggedMeals] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  if (!diet || !diet.meals || diet.meals.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">No Diet Assigned</h3>
        <p className="text-sm text-slate-500 mt-2">Your trainer hasn't assigned a meal plan yet.</p>
      </div>
    );
  }

  // Calculate totals from assigned meals
  let totalCal = 0, totalPro = 0, totalCarb = 0, totalFat = 0;
  diet.meals.forEach((m: any) => {
    totalCal += m.calories || 0;
    totalPro += m.protein || 0;
    totalCarb += m.carbs || 0;
    totalFat += m.fats || 0; // assuming fats in db
  });

  const macros = {
    calories: { current: totalCal > 200 ? totalCal - 200 : totalCal, target: totalCal || 2000, label: "Calories", unit: "kcal", color: "text-orange-500" },
    protein: { current: totalPro > 20 ? totalPro - 20 : totalPro, target: totalPro || 150, label: "Protein", unit: "g", color: "text-blue-500" },
    carbs: { current: totalCarb > 30 ? totalCarb - 30 : totalCarb, target: totalCarb || 200, label: "Carbs", unit: "g", color: "text-emerald-500" },
    fat: { current: totalFat > 10 ? totalFat - 10 : totalFat, target: totalFat || 60, label: "Fat", unit: "g", color: "text-purple-500" }
  };

  const getMealIcon = (mealName: string) => {
    const name = mealName.toLowerCase();
    if (name.includes("break")) return { icon: Coffee, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" };
    if (name.includes("lunch")) return { icon: Utensils, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" };
    if (name.includes("snack")) return { icon: AppleIcon, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" };
    if (name.includes("dinner")) return { icon: Moon, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30" };
    return { icon: Utensils, color: "text-slate-600 bg-slate-100 dark:bg-slate-900/30" };
  };

  const handleLogMeal = (mealId: string) => {
    setLoggedMeals(prev => ({ ...prev, [mealId]: true }));
    toast.success("Meal logged successfully!");
  };

  return (
    <div className="space-y-6">
      
      {/* Macros Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" /> Daily Macros
          </h2>
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300">{diet.name}</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {Object.entries(macros).map(([key, m]) => (
            <div key={key} className="flex flex-col items-center">
              <div className="relative w-12 h-12 mb-2">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={125} 
                    strokeDashoffset={125 - (125 * (m.current / m.target))}
                    className={`${m.color} stroke-current transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">
                    {Math.round((m.current / m.target) * 100) || 0}%
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">{m.label}</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.current}<span className="font-normal text-[10px] text-slate-500">{m.unit}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Water Intake (Static demo for now) */}
      <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Water Intake</h4>
            <p className="text-xs text-slate-500">Goal: 3.0 L</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">2.5<span className="text-sm font-medium ml-1">L</span></span>
        </div>
      </div>

      {/* Meals */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 px-1">Meal Plan</h3>
        <div className="space-y-4">
          {diet.meals.map((meal: any) => {
            const { icon: Icon, color } = getMealIcon(meal.name);
            const isCompleted = loggedMeals[meal.id];
            
            return (
              <div key={meal.id} className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm transition-all ${isCompleted ? 'opacity-70 border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800 shadow-md relative z-10'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{meal.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{meal.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{meal.calories} kcal</span>
                  </div>
                </div>
                
                <ul className="space-y-1.5 pl-1 mb-2">
                  <li className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0 mt-1.5"></span>
                    <span>{meal.foods}</span>
                  </li>
                </ul>
                
                <div className="flex gap-3 text-xs text-slate-500 mb-3 pl-3">
                  {meal.protein && <span>P: {meal.protein}g</span>}
                  {meal.carbs && <span>C: {meal.carbs}g</span>}
                  {meal.fats && <span>F: {meal.fats}g</span>}
                </div>
                
                {!isCompleted && (
                  <button 
                    onClick={() => handleLogMeal(meal.id)}
                    className="w-full mt-2 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors active:scale-[0.98]"
                  >
                    Log Meal
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}



