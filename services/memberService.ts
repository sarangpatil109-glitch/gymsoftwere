import { supabase } from "@/lib/supabase";
import { Member } from "@/types/member";

// Helper to map UI camelCase to DB snake_case
const toDbMember = (member: Partial<Member>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbMember: any = {};
  if (member.id && !member.id.startsWith("M-")) dbMember.id = member.id;
  if (member.id && member.id.startsWith("M-")) {
    // If it's a dummy ID, don't pass it so the DB generates a UUID and sequence member_id
  }
  
  if (member.photoUrl !== undefined) dbMember.photo_url = member.photoUrl;
  if (member.fullName !== undefined) dbMember.full_name = member.fullName;
  if (member.gender !== undefined) dbMember.gender = member.gender;
  if (member.dateOfBirth !== undefined) dbMember.date_of_birth = member.dateOfBirth;
  if (member.age !== undefined) dbMember.age = member.age;
  if (member.mobileNumber !== undefined) dbMember.mobile = member.mobileNumber;
  if (member.whatsappNumber !== undefined) dbMember.whatsapp = member.whatsappNumber;
  if (member.email !== undefined) dbMember.email = member.email;
  if (member.address !== undefined) dbMember.address = member.address;
  if (member.emergencyContact !== undefined) dbMember.emergency_contact = member.emergencyContact;
  if (member.height !== undefined) dbMember.height = member.height;
  if (member.weight !== undefined) dbMember.weight = member.weight;
  if (member.bmi !== undefined) dbMember.bmi = member.bmi;
  if (member.goal !== undefined) dbMember.goal = member.goal;
  if (member.joiningDate !== undefined) dbMember.joining_date = member.joiningDate;
  if (member.membershipType !== undefined) dbMember.membership_type = member.membershipType;
  if (member.amount !== undefined) dbMember.membership_amount = member.amount;
  if (member.discount !== undefined) dbMember.discount = member.discount;
  if (member.finalAmount !== undefined) dbMember.final_amount = member.finalAmount;
  if (member.paymentStatus !== undefined) dbMember.payment_status = member.paymentStatus;
  if (member.expiryDate !== undefined) dbMember.membership_expiry = member.expiryDate;
  if (member.medicalConditions !== undefined) dbMember.medical_conditions = member.medicalConditions;
  if (member.notes !== undefined) dbMember.notes = member.notes;

  return dbMember;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDbMember = (db: any): Member => {
  return {
    // The visual member_id like GM000001 is mapped to a custom property if needed, but the UI expects id as string
    // Let's actually expose member_id as the visible ID in the UI to match the "M-1001" expectation
    // Wait, the UI uses `member.id` for display and for react keys. Let's map db.member_id to a new field or use it as display.
    // For now, let's keep `id` as the UUID for react-query caching and mutation, and we'll add `memberId` for display.
    // Actually, I'll map the UI `member.id` to the DB's `member_id` for display, and keep a hidden `dbId` if needed, 
    // OR just use the UUID as `id` and display a truncated version or add `member_id` to the type.
    // The user requested `member_id TEXT UNIQUE`. Let's map it.
    id: db.id, // primary key
    memberId: db.member_id, // display ID e.g. GM00001
    memberSlug: db.member_slug,
    portalUrl: db.portal_url,
    photoUrl: db.photo_url || "",
    fullName: db.full_name,
    gender: db.gender,
    dateOfBirth: db.date_of_birth,
    age: db.age,
    mobileNumber: db.mobile,
    whatsappNumber: db.whatsapp || "",
    email: db.email,
    address: db.address || "",
    emergencyContact: db.emergency_contact || "",
    height: Number(db.height),
    weight: Number(db.weight),
    bmi: Number(db.bmi),
    goal: db.goal,
    joiningDate: db.joining_date,
    membershipType: db.membership_type,
    amount: Number(db.membership_amount),
    discount: Number(db.discount),
    finalAmount: Number(db.final_amount),
    paymentStatus: db.payment_status,
    expiryDate: db.membership_expiry,
    medicalConditions: db.medical_conditions || "",
    notes: db.notes || "",
    // Calculate status dynamically based on expiry date
    status: new Date(db.membership_expiry) >= new Date() ? "Active" : "Expired",
  };
};

export const memberService = {
  async getMembers() {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(fromDbMember);
  },

  async createMember(member: Partial<Member>) {
    const dbMember = toDbMember(member);
    const { data, error } = await supabase
      .from("members")
      .insert(dbMember)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromDbMember(data);
  },

  async updateMember(id: string, member: Partial<Member>) {
    const dbMember = toDbMember(member);
    const { data, error } = await supabase
      .from("members")
      .update(dbMember)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromDbMember(data);
  },

  async deleteMember(id: string) {
    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },

  async uploadPhoto(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("member-photos")
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from("member-photos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
