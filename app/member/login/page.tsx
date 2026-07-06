"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { loginMember } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MemberLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const result = await loginMember(email);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.memberSlug) {
        toast.success("Welcome back!");
        router.push(`/member/${result.memberSlug}`);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Member Portal</h1>
          <p className="text-center text-slate-500 text-sm mb-8">Enter your registered email to access your fitness journey.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  type="email" 
                  placeholder="john@example.com"
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Powered by GymOS • <a href="#" className="text-blue-600 hover:underline">Need help?</a>
          </p>
        </div>
      </div>
    </div>
  );
}
