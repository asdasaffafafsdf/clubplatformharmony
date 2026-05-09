export interface User {
    id: number;
    username: string;
    student_id?: string;
    club_id?: number;
    club_name?: string;
}
export interface Club {
    id: number;
    name: string;
    description: string;
    created_at?: string;
}
export interface Event {
    id: number;
    title: string;
    content: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
    created_at?: string;
    signup_count?: number;
}
export interface Member {
    id: number;
    name: string;
    student_id: string;
    phone?: string;
    role?: string;
    club_id: number;
    created_at?: string;
}
export interface ApiResponse<T = void> {
    code: number;
    msg: string;
    data?: T;
}
export interface LoginReq {
    username: string;
    password: string;
}
export interface MemberLoginReq {
    username: string;
    studentId: string;
}
export interface JoinClubReq {
    member_id: number;
    club_id: number;
}
export interface SignupReq {
    event_id: number;
    member_id: number;
}
export interface CheckinReq {
    event_id: number;
    member_id: number;
}
export enum UserType {
    ADMIN = "admin",
    MEMBER = "member"
}
