if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MemberCheckin_Params {
    signups?: EventSignup[];
    loading?: boolean;
    message?: string;
    showMessage?: boolean;
    userInfo?: UserInfo | undefined;
    memberId?: number;
}
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
interface UserInfo {
    id: number;
    name: string;
    student_id: string;
}
interface EventSignup {
    event_id: number;
    member_id: number;
    student_id: string;
    name: string;
    title: string;
    sign_up_time: string;
    checkin_status: number;
    checkin_time: string | null;
}
interface CheckInReq {
    event_id: number;
    member_id: number;
}
interface ApiResponse<T = undefined> {
    code: number;
    data?: T;
    msg?: string;
}
class MemberCheckin extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__signups = new ObservedPropertyObjectPU([], this, "signups");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__showMessage = new ObservedPropertySimplePU(false, this, "showMessage");
        this.userInfo = AppStorage.get('user_info');
        this.memberId = 0;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MemberCheckin_Params) {
        if (params.signups !== undefined) {
            this.signups = params.signups;
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
    }
    updateStateVars(params: MemberCheckin_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__signups.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__showMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__signups.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__showMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __signups: ObservedPropertyObjectPU<EventSignup[]>;
    get signups() {
        return this.__signups.get();
    }
    set signups(newValue: EventSignup[]) {
        this.__signups.set(newValue);
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
    aboutToAppear() {
        if (this.userInfo) {
            this.memberId = this.userInfo.id;
        }
        this.loadMySignups();
    }
    async loadMySignups(): Promise<void> {
        if (this.memberId <= 0)
            return;
        this.loading = true;
        const req = http.createHttp();
        try {
            // ======================
            // 【唯一修复】换成带签到状态的接口！
            // ======================
            const res = await req.request(Api.EVENT_SIGNUPS_ALL, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' }
            });
            let result: ApiResponse<EventSignup[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result) as ApiResponse<EventSignup[]>;
            }
            else {
                result = { code: -1 };
            }
            if (result.code === 0 && result.data) {
                this.signups = result.data.filter(item => item.member_id === this.memberId);
            }
        }
        finally {
            this.loading = false;
            req.destroy();
        }
    }
    async performCheckIn(eventId: number): Promise<void> {
        if (this.memberId <= 0)
            return;
        const reqData: CheckInReq = {
            event_id: eventId,
            member_id: this.memberId
        };
        const req = http.createHttp();
        try {
            const res = await req.request(Api.MEMBER_CHECKIN, {
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
                this.showMsg('签到成功');
                this.loadMySignups(); // 签到后重新拉取最新状态
            }
            else {
                this.showMsg(result.msg ?? '签到失败');
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
            Stack.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(124:5)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(125:7)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的签到');
            Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(126:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的报名记录');
            Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(127:9)", "entry");
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(130:11)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                    }, LoadingProgress);
                });
            }
            else if (this.signups.length > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 8 });
                        List.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(132:11)", "entry");
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
                                    ListItem.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(134:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 6 });
                                        Column.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(135:17)", "entry");
                                        Column.padding(12);
                                        Column.backgroundColor('#fff');
                                        Column.borderRadius(10);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(136:19)", "entry");
                                        Row.width('100%');
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.name);
                                        Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(137:21)", "entry");
                                        Text.fontSize(16);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.checkin_status === 1) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('已签到');
                                                    Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(139:23)", "entry");
                                                    Text.backgroundColor('#4CAF50');
                                                    Text.fontColor('#fff');
                                                    Text.padding(4);
                                                    Text.borderRadius(4);
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('未签到');
                                                    Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(141:23)", "entry");
                                                    Text.backgroundColor('#FF9800');
                                                    Text.fontColor('#fff');
                                                    Text.padding(4);
                                                    Text.borderRadius(4);
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`活动：${item.title}`);
                                        Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(145:19)", "entry");
                                        Text.fontSize(14);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`报名：${item.sign_up_time.slice(0, 16)}`);
                                        Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(146:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.checkin_status !== 1) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithLabel('立即签到');
                                                    Button.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(149:21)", "entry");
                                                    Button.width('100%');
                                                    Button.onClick(() => this.performCheckIn(item.event_id));
                                                }, Button);
                                                Button.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('已完成签到');
                                                    Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(151:21)", "entry");
                                                    Text.fontColor('#4CAF50');
                                                    Text.alignSelf(ItemAlign.End);
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Column.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.signups, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无报名信息');
                        Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(161:11)", "entry");
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
                        Text.debugLine("entry/src/main/ets/pages/MemberCheckin.ets(166:9)", "entry");
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
        return "MemberCheckin";
    }
}
registerNamedRoute(() => new MemberCheckin(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/MemberCheckin", pageFullPath: "entry/src/main/ets/pages/MemberCheckin", integratedHsp: "false", moduleType: "followWithHap" });
