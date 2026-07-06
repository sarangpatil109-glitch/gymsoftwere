"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FactoryResetSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetInput, setResetInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const queryClient = useQueryClient();

  const resetState = () => {
    setStep(1);
    setResetInput("");
    setIsChecked(false);
    setPassword("");
    setIsProcessing(false);
  };

  const handleOpen = () => {
    resetState();
    setIsModalOpen(true);
  };

  const handleClose = () => {
    if (isProcessing) return;
    setIsModalOpen(false);
    resetState();
  };

  const nextStep = () => {
    if (step < 4) setStep((s) => (s + 1) as any);
  };

  const executeFactoryReset = async () => {
    setIsProcessing(true);
    try {
      // 1. Verify Password
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.email) throw new Error("Could not identify current user.");

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: password,
      });

      if (authError) {
        throw new Error("Invalid admin password.");
      }

      // 2. Execute RPC
      const { error: rpcError } = await supabase.rpc("factory_reset");
      if (rpcError) throw rpcError;

      // 3. Post-Reset Success
      toast.success("Factory Reset Complete", {
        description: "All business data has been permanently deleted.",
      });

      queryClient.clear();
      setIsModalOpen(false);
      
      // Force reload to clear all states completely
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      toast.error("Factory Reset Failed", {
        description: error.message || "An unexpected error occurred.",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-8 border-red-200 dark:border-red-900/30">
      <div className="flex items-start justify-between p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg relative overflow-hidden">
        {/* Subtle danger strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
        
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-semibold">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg">Danger Zone: Factory Reset</h3>
          </div>
          <p className="text-sm text-red-800 dark:text-red-300">
            This action permanently removes all business data (Members, Attendance, Payments, Leads, Inventory, etc.). 
            The application structure, settings, and database schema will remain intact. <strong>This action cannot be undone.</strong>
          </p>
        </div>
        
        <Button variant="destructive" onClick={handleOpen} className="shrink-0 ml-4">
          Factory Reset
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Factory Reset
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <>
              <DialogDescription className="space-y-4">
                <p>This will permanently delete all business data. This action CANNOT be reversed.</p>
                <div className="space-y-2 mt-4">
                  <Label>Type <span className="font-bold text-foreground">RESET</span> to continue.</Label>
                  <Input 
                    value={resetInput} 
                    onChange={(e) => setResetInput(e.target.value)} 
                    placeholder="RESET"
                    autoComplete="off"
                  />
                </div>
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button variant="destructive" onClick={nextStep} disabled={resetInput !== "RESET"}>Next Step</Button>
              </DialogFooter>
            </>
          )}

          {step === 2 && (
            <>
              <DialogDescription className="space-y-4 py-4">
                <div className="flex items-center space-x-2 bg-muted/50 p-4 rounded-md border">
                  <Checkbox 
                    id="understand" 
                    checked={isChecked} 
                    onCheckedChange={(c: boolean) => setIsChecked(c)} 
                  />
                  <label
                    htmlFor="understand"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                  >
                    I understand this action cannot be undone.
                  </label>
                </div>
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button variant="destructive" onClick={nextStep} disabled={!isChecked}>Next Step</Button>
              </DialogFooter>
            </>
          )}

          {step === 3 && (
            <>
              <DialogDescription className="space-y-4">
                <p>Please enter your Admin Password to verify your identity.</p>
                <div className="space-y-2 mt-4">
                  <Label>Admin Password</Label>
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                  />
                </div>
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button variant="destructive" onClick={nextStep} disabled={!password}>Next Step</Button>
              </DialogFooter>
            </>
          )}

          {step === 4 && (
            <>
              <DialogDescription className="space-y-4 py-2">
                <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                  <p className="font-bold mb-2">Final Warning!</p>
                  <p className="text-sm">You are about to completely wipe all GymOS business data. Are you absolutely sure?</p>
                </div>
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose} disabled={isProcessing}>Cancel</Button>
                <Button variant="destructive" onClick={executeFactoryReset} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete All Data
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
