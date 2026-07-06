"use client";
import React from 'react';

import { usePortalMemberBySlug, usePortalProgress, usePortalPhotos } from "@/hooks/useMemberPortal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Camera, Image as ImageIcon, Scale, ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { format, parseISO } from "date-fns";

export default function MemberProgressPage(props: { params: Promise<{ slug: string }> }) {
  const params = React.use(props.params);
  const { slug } = params;
  const { data: member } = usePortalMemberBySlug(slug);
  const memberId = member?.member_id || "";
  const { data: progress, isLoading: isProgressLoading } = usePortalProgress(memberId);
  const { data: photos, isLoading: isPhotosLoading } = usePortalPhotos(memberId);

  if (isProgressLoading || isPhotosLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  // Format data for chart
  const weightData = (progress || []).map(p => ({
    date: format(parseISO(p.date), 'MMM d'),
    weight: p.weight,
    fullDate: p.date
  })).slice(-10); // Last 10 records

  const latest = progress && progress.length > 0 ? progress[progress.length - 1] : null;
  const previous = progress && progress.length > 1 ? progress[progress.length - 2] : null;

  const currentWeight = latest?.weight || 0;
  const weightChange = previous && latest ? parseFloat((latest.weight - previous.weight).toFixed(1)) : 0;
  const totalWeightLoss = progress && progress.length > 1 
    ? parseFloat((progress[progress.length - 1].weight - progress[0].weight).toFixed(1)) 
    : 0;

  const measurements = [
    { label: "Chest", current: latest?.measurements?.chest || 0, previous: previous?.measurements?.chest || 0 },
    { label: "Waist", current: latest?.measurements?.waist || 0, previous: previous?.measurements?.waist || 0 },
    { label: "Biceps", current: latest?.measurements?.biceps || 0, previous: previous?.measurements?.biceps || 0 },
    { label: "Thighs", current: latest?.measurements?.thighs || 0, previous: previous?.measurements?.thighs || 0 },
  ].filter(m => m.current > 0);

  return (
    <div className="space-y-6">
      
      {/* Weight Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-500" /> Weight Tracking
            </h2>
            <p className="text-xs text-slate-500 mt-1">Recent Logs</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{currentWeight > 0 ? currentWeight : '--'}<span className="text-sm font-normal text-slate-500">kg</span></span>
            {totalWeightLoss !== 0 && (
              <p className={`text-[10px] font-medium flex items-center justify-end mt-0.5 ${totalWeightLoss < 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                {totalWeightLoss < 0 ? <ArrowDown className="h-3 w-3 mr-0.5" /> : <ArrowUp className="h-3 w-3 mr-0.5" />} 
                {Math.abs(totalWeightLoss)}kg total change
              </p>
            )}
          </div>
        </div>
        
        <div className="h-48 w-full -ml-4">
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              No weight data logged yet.
            </div>
          )}
        </div>
      </div>

      {/* Body Measurements */}
      {measurements.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 px-1">Measurements</h3>
          <div className="grid grid-cols-2 gap-3">
            {measurements.map((m, idx) => {
              const change = parseFloat((m.current - m.previous).toFixed(1));
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{m.label}</p>
                  <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100">{m.current} cm</h4>
                  {change !== 0 && m.previous > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {change < 0 ? (
                        <ArrowDown className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowUp className="h-3 w-3 text-blue-500" />
                      )}
                      <span className={`text-[10px] font-medium ${change < 0 ? 'text-emerald-500' : 'text-blue-500'}`}>
                        {Math.abs(change)} cm
                      </span>
                      <span className="text-[10px] text-slate-400 line-through ml-1">{m.previous}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Photos */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Progress Photos</h3>
          <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {/* Add New */}
          <div className="w-28 h-36 shrink-0 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 snap-start active:bg-slate-100 transition-colors cursor-pointer">
            <Camera className="h-6 w-6 mb-2" />
            <span className="text-xs font-medium">Add Photo</span>
          </div>
          
          {/* Photos */}
          {photos?.map((photo: any) => (
            <div key={photo.id} className="w-28 h-36 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800 relative overflow-hidden snap-start shadow-sm border border-slate-200 dark:border-slate-700">
              {photo.photo_url ? (
                <img src={photo.photo_url} alt={photo.type} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                    <ImageIcon className="h-8 w-8 opacity-20" />
                  </div>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] text-white font-medium">{format(parseISO(photo.date), 'MMM d, yyyy')}</p>
                <p className="text-[9px] text-white/70 capitalize">{photo.type || "Front"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}



