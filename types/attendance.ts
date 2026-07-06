import { Member } from "./member";

export type AttendanceStatus = "Present" | "Absent" | "Late";
export type AttendanceSource = "Manual" | "QR";

export interface Attendance {
  id: string; // UUID
  memberId: string; // UUID of the member
  attendanceDate: string; // YYYY-MM-DD
  checkInTime: string; // ISO String
  checkOutTime: string | null; // ISO String
  status: AttendanceStatus;
  source: AttendanceSource;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceWithMember extends Attendance {
  member: Member;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  total: number;
  percentage: number;
}
