export const DEMO_MEMBER = {
  id: "demo-uuid-0001",
  member_id: "GM000001",
  member_slug: "sarang-patil",
  first_name: "Sarang",
  last_name: "Patil",
  email: "demo@example.com",
  phone: "+1 234 567 8900",
  photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=GM000001",
  status: "Active",
  membershipType: "Pro Plan",
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  joiningDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  goal: "Muscle Gain",
  age: 28,
  mobileNumber: "+1 234 567 8900",
  fullName: "Sarang Patil",
  address: "123 Fitness Street",
  emergency_contact: "Jane Patil (+1 987 654 3210)",
};

export const DEMO_MEMBERSHIP = {
  id: "demo-membership-uuid",
  member_id: "demo-uuid-0001",
  status: "ACTIVE",
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  plan: {
    name: "Pro Plan - 12 Months",
    price: 500,
    duration_months: 12
  }
};

export const DEMO_ATTENDANCE = [
  { id: "att-1", member_id: "demo-uuid-0001", check_in: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), attendanceDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), checkInTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: "Present" },
  { id: "att-2", member_id: "demo-uuid-0001", check_in: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), attendanceDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), checkInTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: "Present" },
  { id: "att-3", member_id: "demo-uuid-0001", check_in: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), attendanceDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), checkInTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: "Present" },
];

export const DEMO_WORKOUT = {
  id: "demo-workout-uuid",
  member_id: "demo-uuid-0001",
  name: "Push Day - Hypertrophy",
  notes: "Focus on form and mind-muscle connection.",
  is_active: true,
  exercises: [
    { id: "ex-1", exercise: { name: "Bench Press", video_url: "https://www.youtube.com/watch?v=vcBig73ojpE" }, sets: 4, reps: 10, weight: "60kg", rest_seconds: 90, notes: "Touch chest, explode up" },
    { id: "ex-2", exercise: { name: "Incline Dumbbell Press", video_url: "https://www.youtube.com/watch?v=8iPEnn-ltC8" }, sets: 3, reps: 12, weight: "25kg", rest_seconds: 90, notes: "Keep elbows tucked" },
    { id: "ex-3", exercise: { name: "Lateral Raises", video_url: "https://www.youtube.com/watch?v=3VcKaXpzqRo" }, sets: 4, reps: 15, weight: "10kg", rest_seconds: 60, notes: "Slight bend in elbows" },
  ]
};

export const DEMO_DIET = {
  id: "demo-diet-uuid",
  member_id: "demo-uuid-0001",
  name: "Lean Bulking Plan",
  is_active: true,
  meals: [
    { id: "meal-1", name: "Breakfast", time: "08:00 AM", foods: "4 Whole Eggs, 2 slices Whole Wheat Toast, 1 Banana", calories: 550, protein: 32, carbs: 55, fats: 22 },
    { id: "meal-2", name: "Lunch", time: "01:00 PM", foods: "200g Chicken Breast, 150g Rice, Broccoli", calories: 600, protein: 55, carbs: 70, fats: 8 },
    { id: "meal-3", name: "Pre-Workout Snack", time: "05:00 PM", foods: "1 Scoop Whey Protein, Apple", calories: 200, protein: 25, carbs: 25, fats: 2 },
    { id: "meal-4", name: "Dinner", time: "08:30 PM", foods: "200g Salmon, Sweet Potato, Asparagus", calories: 580, protein: 45, carbs: 40, fats: 25 },
  ]
};

export const DEMO_PROGRESS = [
  { id: "prog-1", member_id: "demo-uuid-0001", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), weight: 75.5, measurements: { chest: 100, waist: 85, biceps: 35, thighs: 55 } },
  { id: "prog-2", member_id: "demo-uuid-0001", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), weight: 76.2, measurements: { chest: 101, waist: 84, biceps: 35.5, thighs: 56 } },
  { id: "prog-3", member_id: "demo-uuid-0001", date: new Date().toISOString(), weight: 76.8, measurements: { chest: 102, waist: 83.5, biceps: 36, thighs: 56.5 } },
];

export const DEMO_PHOTOS = [
  { id: "photo-1", member_id: "demo-uuid-0001", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), type: "Front", photo_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=300&auto=format&fit=crop" },
  { id: "photo-2", member_id: "demo-uuid-0001", date: new Date().toISOString(), type: "Front", photo_url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=300&auto=format&fit=crop" },
];

export const DEMO_PAYMENTS = [
  { id: "pay-1", member_id: "demo-uuid-0001", paymentDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), amountPaid: 500, status: "Paid" },
  { id: "pay-2", member_id: "demo-uuid-0001", paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), amountPaid: 500, status: "Paid" },
];
