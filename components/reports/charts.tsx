/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMonthlyRevenueTrend, useMemberGrowthTrend, useDailyAttendanceTrend, useMembershipDistribution, usePaymentMethodsDistribution } from "@/hooks/useAnalytics";
import { useSystemPreferences } from "@/hooks/useSettings";
import { format, parseISO } from "date-fns";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function RevenueTrendChart() {
  const { data, isLoading } = useMonthlyRevenueTrend(6); // Last 6 months
  const { data: prefs } = useSystemPreferences();
  
  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl" />;
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center border rounded-xl text-muted-foreground">No data available</div>;

  const chartData = data.map(d => ({
    name: format(parseISO(d.month), 'MMM yyyy'),
    Revenue: d.total_revenue
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `${prefs?.currencySymbol || '₹'}${value}`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: any) => [`${prefs?.currencySymbol || '₹'}${Number(value).toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function MemberGrowthChart() {
  const { data, isLoading } = useMemberGrowthTrend(6);
  
  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl" />;
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center border rounded-xl text-muted-foreground">No data available</div>;

  const chartData = data.map(d => ({
    name: format(parseISO(d.month), 'MMM yyyy'),
    Members: d.new_members
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Member Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="Members" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyAttendanceChart() {
  const { data, isLoading } = useDailyAttendanceTrend(14); // Last 14 days
  
  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl" />;
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center border rounded-xl text-muted-foreground">No data available</div>;

  const chartData = data.map(d => ({
    name: format(parseISO(d.date), 'dd MMM'),
    Attendance: d.total_attendances
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Attendance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="Attendance" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function MembershipDistributionChart() {
  const { data, isLoading } = useMembershipDistribution();
  
  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl" />;
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center border rounded-xl text-muted-foreground">No data available</div>;

  const chartData = data.map(d => ({
    name: d.membership_type,
    value: d.total_count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentMethodChart() {
  const { data: prefs } = useSystemPreferences();
  const { data, isLoading } = usePaymentMethodsDistribution();
  
  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl" />;
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center border rounded-xl text-muted-foreground">No data available</div>;

  const chartData = data.map(d => ({
    name: d.payment_method,
    value: d.total_amount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name }) => name}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${prefs?.currencySymbol || '₹'}${Number(value).toLocaleString()}`, 'Revenue']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
