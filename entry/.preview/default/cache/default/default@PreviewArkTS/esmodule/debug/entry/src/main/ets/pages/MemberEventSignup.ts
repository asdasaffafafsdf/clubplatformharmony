if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MemberEventSignup_Params {
    events?: Event[];
    mySignupEventIds?: Set<number>;
    loading?: boolean;
    message?: string;
    showMessage?: boolean;
    userInfo?: UserInfo | undefined;
    memberId?: number;
    myStudentId?: string;
    myClubId?: number;
}
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
interface UserInfo {
    id: number;
    name: string;
    student_id: string;
    club_id: number; // 必须加这个
}
interface Event {
    id: number;
    club_id: number;
    title: string;
    content: string;
    location: string;
    start_time: string;
    end_time: string;
    status: string;
}
interface SignupRecord {
    event_id: number;
    member_id: number;
    student_id: string;
}
interface SignupReq {
    event_id: number;
    member_id: number;
}
interface ApiResponse<T = undefined> {
    code: number;
    data?: T;
    msg?: string;
}
class MemberEventSignup extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__events = new ObservedPropertyObjectPU([], this, "events");
        this.__mySignupEventIds = new ObservedPropertyObjectPU(new Set(), this, "mySignupEventIds");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__showMessage = new ObservedPropertySimplePU(false, this, "showMessage");
        this.userInfo = AppStorage.get('user_info');
        this.memberId = 0;
        this.myStudentId = '';
        this.myClubId = 0 // 自己社团ID
        ;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MemberEventSignup_Params) {
        if (params.events !== undefined) {
            this.events = params.events;
        }
        if (params.mySignupEventIds !== undefined) {
            this.mySignupEventIds = params.mySignupEventIds;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.showMessage !== undefined) {
            this.showMessage = params.showMessage;
        }
        if (params.userInfo !== undefined) {
            this.userInfo = params.userInfo;
        }
        if (params.memberId !== undefined) {
            this.memberId = params.memberId;
        }
        if (params.myStudentId !== undefined) {
            this.myStudentId = params.myStudentId;
        }
        if (params.myClubId !== undefined) {
            this.myClubId = params.myClubId;
        }
    }
    updateStateVars(params: MemberEventSignup_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__events.purgeDependencyOnElmtId(rmElmtId);
        this.__mySignupEventIds.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__showMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__events.aboutToBeDeleted();
        this.__mySignupEventIds.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__showMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __events: ObservedPropertyObjectPU<Event[]>;
    get events() {
        return this.__events.get();
    }
    set events(newValue: Event[]) {
        this.__events.set(newValue);
    }
    private __mySignupEventIds: ObservedPropertyObjectPU<Set<number>>;
    get mySignupEventIds() {
        return this.__mySignupEventIds.get();
    }
    set mySignupEventIds(newValue: Set<number>) {
        this.__mySignupEventIds.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __showMessage: ObservedPropertySimplePU<boolean>;
    get showMessage() {
        return this.__showMessage.get();
    }
    set showMessage(newValue: boolean) {
        this.__showMessage.set(newValue);
    }
    private userInfo: UserInfo | undefined;
    private memberId: number;
    private myStudentId: string;
    private myClubId: number; // 自己社团ID
    aboutToAppear() {
        if (this.userInfo) {
            this.memberId = this.userInfo.id;
            this.myStudentId = this.userInfo.student_id;
            this.myClubId = this.userInfo.club_id; // 取出自己社团
        }
        this.loadEvents();
        this.loadMySignups();
    }
    async loadEvents(): Promise<void> {
        this.loading = true;
        const req = http.createHttp();
        try {
            const res = await req.request(Api.EVENTS, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' }
            });
            let result: ApiResponse<Event[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result) as ApiResponse<Event[]>;
            }
            else {
                result = { code: -1 };
            }
            if (result.code === 0 && result.data) {
                // ==========================
                // 【核心修复】只保留自己社团的活动
                // ==========================
                this.events = result.data.filter(e => e.club_id === this.myClubId);
            }
        }
        catch (err) {
            this.showMsg('网络错误');
        }
        finally {
            this.loading = false;
            req.destroy();
        }
    }
    async loadMySignups(): Promise<void> {
        if (this.memberId <= 0)
            return;
        const req = http.createHttp();
        try {
            const res = await req.request(Api.EVENT_SIGNUPS, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' }
            });
            let result: ApiResponse<SignupRecord[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result) as ApiResponse<SignupRecord[]>;
            }
            else {
                result = { code: -1 };
            }
            if (result.code === 0 && result.data) {
                const ids = new Set<number>();
                result.data.forEach(item => {
                    if (item.member_id === this.memberId) {
                        ids.add(item.event_id);
                    }
                });
                this.mySignupEventIds = ids;
            }
        }
        finally {
            req.destroy();
        }
    }
    async signupEvent(event: Event): Promise<void> {
        if (this.memberId <= 0)
            return;
        const reqData: SignupReq = {
            event_id: event.id,
            member_id: this.memberId
        };
        const req = http.createHttp();
        try {
            const res = await req.request(Api.SIGNUP, {
                method: http.RequestMethod.POST,
                header: { 'Content-Type': 'application/json' },
                extraData: JSON.stringify(reqData)
            });
            let result: ApiResponse;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result) as ApiResponse;
            }
            else {
                result = { code: -1 };
            }
            if (result.code === 0) {
                this.showMsg('报名成功');
                this.mySignupEventIds.add(event.id);
            }
            else {
                this.showMsg(result.msg ?? '报名失败');
            }
        }
        finally {
            req.destroy();
        }
    }
    showMsg(msg: string) {
        this.message = msg;
        this.showMessage = true;
        setTimeout(() => this.showMessage = false, 2000);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(168:5)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(169:7)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('活动报名');
            Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(170:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.alignSelf(ItemAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(173:11)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                    }, LoadingProgress);
                });
            }
            else if (this.events.length > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 8 });
                        List.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(175:11)", "entry");
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(177:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 6 });
                                        Column.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(178:17)", "entry");
                                        Column.padding(12);
                                        Column.backgroundColor('#fff');
                                        Column.borderRadius(10);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(179:19)", "entry");
                                        Row.width('100%');
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.title);
                                        Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(180:21)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.status === 'published' ? '已发布' : '未发布');
                                        Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(181:21)", "entry");
                                        Text.fontSize(12);
                                        Text.backgroundColor('#4CAF50');
                                        Text.fontColor('#fff');
                                        Text.padding(4);
                                        Text.borderRadius(4);
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.content || '无描述');
                                        Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(189:19)", "entry");
                                        Text.fontSize(14);
                                        Text.maxLines(2);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`地点：${item.location}`);
                                        Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(190:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`时间：${item.start_time.substring(0, 16)} - ${item.end_time.substring(0, 16)}`);
                                        Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(191:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Button.createWithLabel(this.mySignupEventIds.has(item.id) ? '已报名' : '立即报名');
                                        Button.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(193:19)", "entry");
                                        Button.width('100%');
                                        Button.enabled(!this.mySignupEventIds.has(item.id));
                                        Button.backgroundColor(this.mySignupEventIds.has(item.id) ? '#ccc' : '#2196F3');
                                        Button.onClick(() => this.signupEvent(item));
                                    }, Button);
                                    Button.pop();
                                    Column.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.events, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无活动');
                        Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(206:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#999');
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.message);
                        Text.debugLine("entry/src/main/ets/pages/MemberEventSignup.ets(211:9)", "entry");
                        Text.width('70%');
                        Text.height(44);
                        Text.backgroundColor('#333');
                        Text.fontColor('#fff');
                        Text.textAlign(TextAlign.Center);
                        Text.position({ left: '15%', top: '10%' });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MemberEventSignup";
    }
}
registerNamedRoute(() => new MemberEventSignup(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/MemberEventSignup", pageFullPath: "entry/src/main/ets/pages/MemberEventSignup", integratedHsp: "false", moduleType: "followWithHap" });
