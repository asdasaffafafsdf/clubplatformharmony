import { http } from "@kit.NetworkKit";

// common/types.ts
export interface ApiResponse<T = void> {
  code: number
  msg: string
  data?: T
}
export interface Club {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface AddClubReq {
  name: string
  description?: string
}


// 在types.ts中添加
export interface HttpRequestOptions {
  url: string;
  method?: http.RequestMethod;
  header?: Record<string, string>;
  data?: string | ArrayBuffer;
  extraData?: object;
  connectTimeout?: number;
  readTimeout?: number;
}



export interface LoginReq {
  username: string
  password: string
}

export interface RegisterReq {
  username: string
  password: string
}

export interface User {
  id: number
  username: string
}
export interface Member {
  id: number
  club_id: number
  name: string
  student_id: string
  phone: string
  role: string
  created_at?: string
}

export interface AddMemberReq {
  name: string
  student_id: string
  phone: string
  club_id: number
  role?: string
}

export interface Event {
  id: number
  club_id: number
  title: string
  content: string
  location: string
  start_time: string
  end_time: string
  status: string
  created_at?: string
}

export interface AddEventReq {
  title: string
  content: string
  location: string
  start_time: string
  end_time: string
  club_id: number
  status?: string
}

export interface CheckInReq {
  event_id: number
  member_id: number
}

export interface SignupReq {
  event_id: number
  member_id: number
}


export interface HttpResponse {
  result: string | object
  responseCode: number
}

export interface EventSignup {
  event_id: number
  member_id: number
  name: string
  student_id: string
  title: string
  sign_up_time: string
  checkin_status: number  // 0未签到，1已签到
  checkin_time?: string
}

export interface EventWithSignup extends Event {
  signup_count?: number
}


export interface UpdateMemberReq {
  name: string
  student_id: string
}

export interface DeleteResponse {
  code: number
  msg?: string
}

export interface QueryMember {
  id: number
  name: string
  student_id: string
}