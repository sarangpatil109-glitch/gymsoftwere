"use client";

import { Member } from "@/types/member";
import { Membership } from "@/types/membership";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, Activity, HeartPulse, UserCheck, Loader2, CreditCard, RefreshCw, Dumbbell, Apple, Calendar, Utensils } from "lucide-react";
import { useMemberAttendanceHistory } from "@/hooks/useAttendance";
import { useMemberMemberships } from "@/hooks/useMemberships";
import { useMemberPayments } from "@/hooks/usePayments";
import { AssignMembershipModal } from "@/components/members/assign-membership-modal";
import { ReceivePaymentModal } from "@/components/payments/receive-payment-modal";
import { AssignWorkoutModal } from "@/components/workouts/assign-workout-modal";
import { AssignDietModal } from "@/components/diet/assign-diet-modal";
import { useWorkoutPlans } from "@/hooks/useWorkout";
import { useDietPlans } from "@/hooks/useDiet";
import { useMemberMeasurements, useMemberPhotos } from "@/hooks/useProgress";
import { MeasurementsFormModal } from "@/components/progress/measurements-form-modal";
import { PhotosUploadModal } from "@/components/progress/photos-upload-modal";
import { ProgressCharts } from "@/components/progress/progress-charts";
import { PhotoComparison } from "@/components/progress/photo-comparison";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ViewMemberDrawerProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMemberDrawer({ member, open, onOpenChange }: ViewMemberDrawerProps) {
  const { data: attendanceHistory, isLoading: isLoadingHistory } = useMemberAttendanceHistory(member?.id || "");
  const { data: memberships, isLoading: isLoadingMemberships } = useMemberMemberships(member?.id || "");
  const { data: payments, isLoading: isLoadingPayments } = useMemberPayments(member?.id || "");
  
  const { data: workoutPlans, isLoading: isLoadingWorkouts } = useWorkoutPlans(member?.id || "");
  const { data: dietPlans, isLoading: isLoadingDiets } = useDietPlans(member?.id || "");
  
  const { data: measurements, isLoading: isLoadingMeasurements } = useMemberMeasurements(member?.id || "");
  const { data: progressPhotos, isLoading: isLoadingPhotos } = useMemberPhotos(member?.id || "");

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isReceivePaymentOpen, setIsReceivePaymentOpen] = useState(false);
  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false);
  const [isAssignDietOpen, setIsAssignDietOpen] = useState(false);
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const [isUploadPhotosOpen, setIsUploadPhotosOpen] = useState(false);
  const [selectedMembershipForPayment, setSelectedMembershipForPayment] = useState<Membership | null>(null);

  if (!member) return null;

  const currentMembership = memberships?.[0]; // assuming sorted by newest first

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col bg-background">
        <SheetHeader className="px-6 py-6 border-b border-border bg-muted/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={member.photoUrl} alt={member.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                  {member.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-xl">{member.fullName}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-1">
                  <span>{member.id}</span>
                  <span>•</span>
                  <span>{member.gender}, {member.age} yrs</span>
                </SheetDescription>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className={
              member.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
              member.status === "Expired" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
              "bg-orange-500/10 text-orange-500 border-orange-500/20"
            }>{member.status}</Badge>
            <Badge variant="secondary">{member.membershipType}</Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <Tabs defaultValue="overview" className="w-full">
            <div className="px-6 border-b sticky top-0 bg-background z-10 pt-2">
              <TabsList className="w-full justify-start rounded-none border-b-0 h-auto p-0 bg-transparent gap-4 overflow-x-auto hide-scrollbar flex-nowrap whitespace-nowrap">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 shrink-0">Overview</TabsTrigger>
                <TabsTrigger value="workout" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 shrink-0">Workout Plan</TabsTrigger>
                <TabsTrigger value="diet" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 shrink-0">Diet Plan</TabsTrigger>
                <TabsTrigger value="measurements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 shrink-0">Measurements</TabsTrigger>
                <TabsTrigger value="progress" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 shrink-0">Progress Charts</TabsTrigger>
                <TabsTrigger value="photos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 shrink-0">Transformation</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.mobileNumber}</span>
                </div>
                {member.whatsappNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    <span>{member.whatsappNumber} (WhatsApp)</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                {member.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="leading-snug">{member.address}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Body Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Body Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Height</p>
                  <p className="font-medium">{member.height} cm</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Weight</p>
                  <p className="font-medium">{member.weight} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">BMI</p>
                  <p className="font-medium">{member.bmi}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Goal</p>
                  <p className="font-medium flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-primary" /> {member.goal}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Membership Details & Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Membership</h4>
                {!currentMembership ? (
                  <Button size="sm" onClick={() => setIsAssignOpen(true)}>Assign Membership</Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsAssignOpen(true)} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Renew
                  </Button>
                )}
              </div>
              
              {isLoadingMemberships ? (
                <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : currentMembership ? (
                <div className="rounded-lg border bg-card p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{currentMembership.membershipType}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(currentMembership.startDate), "MMM dd, yyyy")} - {format(new Date(currentMembership.expiryDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge variant={currentMembership.status === "Active" ? "default" : "secondary"}>
                      {currentMembership.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount: ₹{currentMembership.finalAmount}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={currentMembership.paymentStatus === "Paid" ? "default" : currentMembership.paymentStatus === "Partial" ? "secondary" : "destructive"}>
                          {currentMembership.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                    {currentMembership.paymentStatus !== "Paid" && (
                      <Button size="sm" onClick={() => {
                        setSelectedMembershipForPayment(currentMembership);
                        setIsReceivePaymentOpen(true);
                      }}>Receive Payment</Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No active membership found.</p>
              )}
            </div>

            <Separator />

            {/* Payment History */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment History
              </h4>
              {isLoadingPayments ? (
                <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : !payments || payments.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No payments recorded.</p>
              ) : (
                <div className="space-y-2">
                  {payments.map(payment => (
                    <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg text-sm">
                      <div>
                        <p className="font-medium">₹{payment.amountPaid} <span className="text-muted-foreground text-xs font-normal">via {payment.paymentMethod}</span></p>
                        <p className="text-xs text-muted-foreground">{format(new Date(payment.paymentDate), "MMM dd, yyyy hh:mm a")}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{payment.receiptNumber}</Badge>
                        {payment.balanceAmount > 0 && <p className="text-xs text-rose-500 mt-1">Bal: ₹{payment.balanceAmount}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extra Info */}
            {(member.medicalConditions || member.notes || member.emergencyContact) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <HeartPulse className="h-4 w-4" /> Medical & Notes
                  </h4>
                  {member.emergencyContact && (
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground block">Emergency Contact:</span>
                      {member.emergencyContact}
                    </div>
                  )}
                  {member.medicalConditions && (
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground block">Medical Conditions:</span>
                      {member.medicalConditions}
                    </div>
                  )}
                  {member.notes && (
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground block">Notes:</span>
                      {member.notes}
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Attendance History */}
            <div className="space-y-3 pb-8">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="h-4 w-4" /> Attendance History
              </h4>
              
              {isLoadingHistory ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : !attendanceHistory || attendanceHistory.length === 0 ? (
                <div className="p-4 bg-muted/20 text-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">No attendance records found.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 bg-muted/50 p-2 text-xs font-semibold text-muted-foreground">
                    <div>Date</div>
                    <div>In</div>
                    <div>Out</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y max-h-48 overflow-y-auto">
                    {attendanceHistory.map((record) => (
                      <div key={record.id} className="grid grid-cols-4 p-2 text-sm items-center">
                        <div className="truncate pr-2">{format(new Date(record.attendanceDate), "MMM dd, yyyy")}</div>
                        <div>{format(new Date(record.checkInTime), "HH:mm")}</div>
                        <div className="text-muted-foreground">
                          {record.checkOutTime ? format(new Date(record.checkOutTime), "HH:mm") : "--:--"}
                        </div>
                        <div>
                          <Badge variant="outline" className={
                            record.status === "Present" ? "text-emerald-500 border-emerald-500/20" : ""
                          }>
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

              </TabsContent>

              <TabsContent value="workout" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                      <Dumbbell className="h-4 w-4" /> Current Workout Plan
                    </h4>
                  </div>
                  <Button size="sm" onClick={() => setIsAssignWorkoutOpen(true)}>Assign Plan</Button>
                </div>
                
                {isLoadingWorkouts ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : workoutPlans && workoutPlans.length > 0 ? (
                  <div className="space-y-4">
                    {workoutPlans.map(plan => (
                      <div key={plan.id} className="border rounded-xl p-4 bg-card">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{plan.name}</h3>
                            {plan.goal && <p className="text-sm text-muted-foreground">Goal: {plan.goal}</p>}
                            {(plan.start_date || plan.end_date) && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" /> 
                                {plan.start_date ? format(new Date(plan.start_date), "MMM dd, yyyy") : "?"} - {plan.end_date ? format(new Date(plan.end_date), "MMM dd, yyyy") : "?"}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {plan.days?.map(day => (
                            <div key={day.id} className="border rounded-lg overflow-hidden">
                              <div className="bg-muted/50 px-3 py-2 font-medium text-sm border-b">
                                {day.day_of_week}
                              </div>
                              <div className="divide-y">
                                {day.exercises?.sort((a,b) => a.sort_order - b.sort_order).map(ex => (
                                  <div key={ex.id} className="p-3 text-sm flex justify-between items-center bg-card">
                                    <div>
                                      <p className="font-semibold">{ex.exercise?.name}</p>
                                      {ex.exercise?.equipment && <p className="text-xs text-muted-foreground">{ex.exercise.equipment}</p>}
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="secondary">{ex.sets} x {ex.reps}</Badge>
                                      <div className="text-xs text-muted-foreground mt-1 flex gap-2 justify-end">
                                        {ex.weight && <span>Wt: {ex.weight}</span>}
                                        {ex.rest_time && <span>Rest: {ex.rest_time}</span>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {(!day.exercises || day.exercises.length === 0) && (
                                  <div className="p-3 text-sm text-muted-foreground italic text-center">Rest Day / No exercises assigned</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed rounded-xl bg-muted/10">
                    <Dumbbell className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">No workout plan assigned.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="diet" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                      <Apple className="h-4 w-4" /> Current Diet Plan
                    </h4>
                  </div>
                  <Button size="sm" onClick={() => setIsAssignDietOpen(true)}>Assign Plan</Button>
                </div>
                
                {isLoadingDiets ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : dietPlans && dietPlans.length > 0 ? (
                  <div className="space-y-4">
                    {dietPlans.map(plan => (
                      <div key={plan.id} className="border rounded-xl p-4 bg-card">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold">Daily Macros Target</h3>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            <div className="bg-primary/10 text-primary p-2 rounded-lg text-center">
                              <p className="text-xs uppercase font-semibold">Calories</p>
                              <p className="font-bold">{plan.daily_calories}</p>
                            </div>
                            <div className="bg-blue-500/10 text-blue-600 p-2 rounded-lg text-center">
                              <p className="text-xs uppercase font-semibold">Protein</p>
                              <p className="font-bold">{plan.protein_target}g</p>
                            </div>
                            <div className="bg-orange-500/10 text-orange-600 p-2 rounded-lg text-center">
                              <p className="text-xs uppercase font-semibold">Carbs</p>
                              <p className="font-bold">{plan.carbs_target}g</p>
                            </div>
                            <div className="bg-amber-500/10 text-amber-600 p-2 rounded-lg text-center">
                              <p className="text-xs uppercase font-semibold">Fat</p>
                              <p className="font-bold">{plan.fat_target}g</p>
                            </div>
                          </div>
                          {(plan.start_date || plan.end_date) && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-3">
                              <Calendar className="h-3 w-3" /> 
                              {plan.start_date ? format(new Date(plan.start_date), "MMM dd, yyyy") : "?"} - {plan.end_date ? format(new Date(plan.end_date), "MMM dd, yyyy") : "?"}
                            </p>
                          )}
                          {plan.notes && (
                            <div className="mt-3 p-3 bg-muted/30 rounded-md text-sm border">
                              <span className="font-semibold block mb-1">Notes:</span>
                              {plan.notes}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2 border-b pb-2"><Utensils className="h-4 w-4" /> Assigned Meals</h4>
                          {plan.meals?.map(meal => (
                            <div key={meal.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                              <div>
                                <Badge className="mb-1" variant="outline">{meal.food?.meal_category}</Badge>
                                <p className="font-semibold">{meal.food?.food_name}</p>
                                <p className="text-xs text-muted-foreground">{meal.day_of_week}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{meal.food?.quantity}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {meal.food?.calories} kcal | P: {meal.food?.protein}g
                                </p>
                              </div>
                            </div>
                          ))}
                          {(!plan.meals || plan.meals.length === 0) && (
                            <p className="text-sm text-muted-foreground italic text-center py-2">No specific meals assigned.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed rounded-xl bg-muted/10">
                    <Apple className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">No diet plan assigned.</p>
                  </div>
                )}
              </TabsContent>

              {/* Measurements Tab */}
              <TabsContent value="measurements" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider">Historical Measurements</h4>
                  </div>
                  <Button size="sm" onClick={() => setIsAddMeasurementOpen(true)}>Log Measurements</Button>
                </div>
                
                {isLoadingMeasurements ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : measurements && measurements.length > 0 ? (
                  <div className="border rounded-xl overflow-x-auto bg-card">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                        <tr>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Weight</th>
                          <th className="px-4 py-3 font-medium">Body Fat %</th>
                          <th className="px-4 py-3 font-medium">Muscle %</th>
                          <th className="px-4 py-3 font-medium">Chest</th>
                          <th className="px-4 py-3 font-medium">Waist</th>
                          <th className="px-4 py-3 font-medium">Arms</th>
                          <th className="px-4 py-3 font-medium">Legs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {measurements.map(m => (
                          <tr key={m.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{format(new Date(m.record_date), "MMM dd, yyyy")}</td>
                            <td className="px-4 py-3">{m.weight ? `${m.weight} kg` : '-'}</td>
                            <td className="px-4 py-3">{m.body_fat_percentage ? `${m.body_fat_percentage}%` : '-'}</td>
                            <td className="px-4 py-3">{m.muscle_percentage ? `${m.muscle_percentage}%` : '-'}</td>
                            <td className="px-4 py-3">{m.chest ? `${m.chest} cm` : '-'}</td>
                            <td className="px-4 py-3">{m.waist ? `${m.waist} cm` : '-'}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {m.biceps && `Bi: ${m.biceps}`} {m.forearm && `Fo: ${m.forearm}`}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {m.thigh && `Th: ${m.thigh}`} {m.calf && `Ca: ${m.calf}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed rounded-xl bg-muted/10">
                    <Activity className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">No measurements logged yet.</p>
                  </div>
                )}
              </TabsContent>

              {/* Progress Charts Tab */}
              <TabsContent value="progress" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider">Progress Charts</h4>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsAddMeasurementOpen(true)}>Add Data</Button>
                </div>
                
                {isLoadingMeasurements ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : (
                  <ProgressCharts measurements={measurements || []} />
                )}
              </TabsContent>

              {/* Transformation Photos Tab */}
              <TabsContent value="photos" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider">Transformation Photos</h4>
                  </div>
                  <Button size="sm" onClick={() => setIsUploadPhotosOpen(true)}>Upload Photos</Button>
                </div>
                
                {isLoadingPhotos ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : (
                  <PhotoComparison photos={progressPhotos || []} />
                )}
              </TabsContent>

            </div>
          </Tabs>
        </ScrollArea>
      </SheetContent>

      {isAssignOpen && (
        <AssignMembershipModal 
          member={member} 
          open={isAssignOpen} 
          onOpenChange={setIsAssignOpen} 
        />
      )}

      {isReceivePaymentOpen && selectedMembershipForPayment && (
        <ReceivePaymentModal 
          member={member} 
          membership={selectedMembershipForPayment}
          open={isReceivePaymentOpen} 
          onOpenChange={setIsReceivePaymentOpen} 
        />
      )}
      {isAssignWorkoutOpen && (
        <AssignWorkoutModal 
          member={member} 
          open={isAssignWorkoutOpen} 
          onOpenChange={setIsAssignWorkoutOpen} 
        />
      )}

      {isAssignDietOpen && (
        <AssignDietModal 
          member={member} 
          open={isAssignDietOpen} 
          onOpenChange={setIsAssignDietOpen} 
        />
      )}

      {isAddMeasurementOpen && (
        <MeasurementsFormModal 
          member={member} 
          open={isAddMeasurementOpen} 
          onOpenChange={setIsAddMeasurementOpen} 
        />
      )}

      {isUploadPhotosOpen && (
        <PhotosUploadModal 
          member={member} 
          open={isUploadPhotosOpen} 
          onOpenChange={setIsUploadPhotosOpen} 
        />
      )}
    </Sheet>
  );
}
