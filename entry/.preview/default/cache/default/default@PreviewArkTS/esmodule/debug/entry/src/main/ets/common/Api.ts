export class Api {
    //static readonly BASE_URL = 'http://192.168.1.149:5000/api'  // 请替换为实际的后端地址
    static readonly BASE_URL = 'http://172.17.244.60:5000/api'; // 请替换为实际的后端地址
    static readonly LOGIN = `${this.BASE_URL}/login`;
    static readonly REGISTER = `${this.BASE_URL}/register`;
    static readonly MEMBERS = `${this.BASE_URL}/members`;
    static readonly CLUBS = `${this.BASE_URL}/clubs`;
    static readonly EVENTS = `${this.BASE_URL}/events`;
    static readonly CHECKIN = `${this.BASE_URL}/checkin`;
    static readonly SIGNUP = `${this.BASE_URL}/event_signups`;
    static readonly EVENT_SIGNUPS = `${this.BASE_URL}/event_signups`;
    static readonly EVENT_SIGNUPS_ALL = `${this.BASE_URL}/event_signups_all`; // 新增API
    static readonly CHAT = `${this.BASE_URL}/chat`; // 新增API
    static readonly MEMBER_LOGIN = `${this.BASE_URL}/member-login`;
    static readonly JOIN_CLUB = `${this.BASE_URL}/join-club`;
    static readonly MEMBER_CHECKIN = `${this.BASE_URL}/member-checkin`;
}
