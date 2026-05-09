if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EventSignupPage_Params {
    events?: Event[];
    loading?: boolean;
    message?: string;
    showMessage?: boolean;
    showSignupDialog?: boolean;
    selectedEvent?: Event | null;
    selectedMemberId?: string;
    allMembers?: Member[];
    signupCount?: Record<number, number>;
}
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
import type { SignupReq, ApiResponse, Event, Member } from '../common/types';
class EventSignupPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__events = new ObservedPropertyObjectPU([], this, "events");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__showMessage = new ObservedPropertySimplePU(false, this, "showMessage");
        this.__showSignupDialog = new ObservedPropertySimplePU(false, this, "showSignupDialog");
        this.__selectedEvent = new ObservedPropertyObjectPU(null, this, "selectedEvent");
        this.__selectedMemberId = new ObservedPropertySimplePU('', this, "selectedMemberId");
        this.__allMembers = new ObservedPropertyObjectPU([], this, "allMembers");
        this.__signupCount = new ObservedPropertyObjectPU({}, this, "signupCount");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EventSignupPage_Params) {
        if (params.events !== undefined) {
            this.events = params.events;
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
        if (params.showSignupDialog !== undefined) {
            this.showSignupDialog = params.showSignupDialog;
        }
        if (params.selectedEvent !== undefined) {
            this.selectedEvent = params.selectedEvent;
        }
        if (params.selectedMemberId !== undefined) {
            this.selectedMemberId = params.selectedMemberId;
        }
        if (params.allMembers !== undefined) {
            this.allMembers = params.allMembers;
        }
        if (params.signupCount !== undefined) {
            this.signupCount = params.signupCount;
        }
    }
    updateStateVars(params: EventSignupPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__events.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__showMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__showSignupDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedEvent.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMemberId.purgeDependencyOnElmtId(rmElmtId);
        this.__allMembers.purgeDependencyOnElmtId(rmElmtId);
        this.__signupCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__events.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__showMessage.aboutToBeDeleted();
        this.__showSignupDialog.aboutToBeDeleted();
        this.__selectedEvent.aboutToBeDeleted();
        this.__selectedMemberId.aboutToBeDeleted();
        this.__allMembers.aboutToBeDeleted();
        this.__signupCount.aboutToBeDeleted();
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
    private __showSignupDialog: ObservedPropertySimplePU<boolean>;
    get showSignupDialog() {
        return this.__showSignupDialog.get();
    }
    set showSignupDialog(newValue: boolean) {
        this.__showSignupDialog.set(newValue);
    }
    private __selectedEvent: ObservedPropertyObjectPU<Event | null>;
    get selectedEvent() {
        return this.__selectedEvent.get();
    }
    set selectedEvent(newValue: Event | null) {
        this.__selectedEvent.set(newValue);
    }
    private __selectedMemberId: ObservedPropertySimplePU<string>;
    get selectedMemberId() {
        return this.__selectedMemberId.get();
    }
    set selectedMemberId(newValue: string) {
        this.__selectedMemberId.set(newValue);
    }
    private __allMembers: ObservedPropertyObjectPU<Member[]>;
    get allMembers() {
        return this.__allMembers.get();
    }
    set allMembers(newValue: Member[]) {
        this.__allMembers.set(newValue);
    }
    private __signupCount: ObservedPropertyObjectPU<Record<number, number>>;
    get signupCount() {
        return this.__signupCount.get();
    }
    set signupCount(newValue: Record<number, number>) {
        this.__signupCount.set(newValue);
    }
    aboutToAppear() {
        this.loadEvents();
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
                result = res.result as ApiResponse<Event[]>;
            }
            if (result.code === 0) {
                this.events = result.data || [];
                await this.updateSignupCounts();
            }
            else {
                this.showMessage = true;
                this.message = result.msg || '加载活动失败';
            }
        }
        catch (error) {
            console.error('加载活动失败:', error);
            this.showMessage = true;
            this.message = '网络错误，请重试';
        }
        finally {
            this.loading = false;
            req.destroy();
        }
    }
    // ======================
    // 【关键修复】只加载当前活动所在社团的成员
    // ======================
    async loadMembersByClubId(clubId: number): Promise<void> {
        const req = http.createHttp();
        try {
            const res = await req.request(`${Api.MEMBERS}?club_id=${clubId}`, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' }
            });
            let result: ApiResponse<Member[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result) as ApiResponse<Member[]>;
            }
            else {
                result = res.result as ApiResponse<Member[]>;
            }
            if (result.code === 0) {
                this.allMembers = result.data || [];
            }
        }
        catch (error) {
            console.error('加载成员失败:', error);
        }
        finally {
            req.destroy();
        }
    }
    async updateSignupCounts(): Promise<void> {
        const counts: Record<number, number> = {};
        for (const event of this.events) {
            const req = http.createHttp();
            try {
                const res = await req.request(`${Api.EVENT_SIGNUPS}?event_id=${event.id}`, {
                    method: http.RequestMethod.GET,
                    header: { 'Content-Type': 'application/json' }
                });
                let result: ApiResponse;
                if (typeof res.result === 'string') {
                    result = JSON.parse(res.result) as ApiResponse;
                }
                else {
                    result = res.result as ApiResponse;
                }
                if (result.code === 0 && Array.isArray(result.data)) {
                    counts[event.id] = result.data.length;
                }
                else {
                    counts[event.id] = 0;
                }
            }
            catch (error) {
                console.error(`获取活动 ${event.id} 报名数失败:`, error);
                counts[event.id] = 0;
            }
            finally {
                req.destroy();
            }
        }
        this.signupCount = counts;
    }
    async signupForEvent(): Promise<void> {
        if (!this.selectedEvent || !this.selectedMemberId) {
            this.showMessage = true;
            this.message = '请选择活动和成员';
            return;
        }
        const reqData: SignupReq = {
            event_id: this.selectedEvent.id,
            member_id: parseInt(this.selectedMemberId)
        };
        const req = http.createHttp();
        try {
            const res = await req.request(Api.SIGNUP, {
                method: http.RequestMethod.POST,
                header: { 'Content-Type': 'application/json' },
                extraData: JSON.stringify(reqData)
            });
            let result: ApiResponse<void>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result) as ApiResponse<void>;
            }
            else {
                result = res.result as ApiResponse<void>;
            }
            if (result.code === 0) {
                this.showMessage = true;
                this.message = result.msg || '报名成功';
                this.showSignupDialog = false;
                this.selectedMemberId = '';
                this.signupCount[this.selectedEvent.id] = (this.signupCount[this.selectedEvent.id] || 0) + 1;
                this.loadEvents();
            }
            else {
                this.showMessage = true;
                this.message = result.msg || '报名失败';
            }
        }
        catch (error) {
            console.error('报名失败:', error);
            this.showMessage = true;
            this.message = '网络错误，请重试';
        }
        finally {
            req.destroy();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/EventSignup.ets(169:5)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/pages/EventSignup.ets(170:7)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('活动报名管理');
            Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(171:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.alignSelf(ItemAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('活动列表');
            Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(173:9)", "entry");
            Text.fontSize(18);
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ top: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/EventSignup.ets(176:11)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.margin({ top: 20 });
                    }, LoadingProgress);
                });
            }
            else if (this.events.length > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 5 });
                        List.debugLine("entry/src/main/ets/pages/EventSignup.ets(178:11)", "entry");
                        List.padding({ top: 10 });
                        List.cachedCount(20);
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
                                    ListItem.debugLine("entry/src/main/ets/pages/EventSignup.ets(180:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 8 });
                                        Column.debugLine("entry/src/main/ets/pages/EventSignup.ets(181:17)", "entry");
                                        Column.padding(10);
                                        Column.width('100%');
                                        Column.height(140);
                                        Column.borderRadius(8);
                                        Column.backgroundColor('#ffffff');
                                        Column.shadow({ radius: 4, color: '#e0e0e0', offsetX: 0, offsetY: 2 });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/EventSignup.ets(182:19)", "entry");
                                        Row.width('100%');
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.title);
                                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(183:21)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.status);
                                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(184:21)", "entry");
                                        Text.fontSize(12);
                                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                                        Text.backgroundColor(item.status === 'published' ? '#4caf50' : '#ff9800');
                                        Text.fontColor('#fff');
                                        Text.borderRadius(6);
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.content || '无描述');
                                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(189:19)", "entry");
                                        Text.fontSize(14);
                                        Text.maxLines(2);
                                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/EventSignup.ets(191:19)", "entry");
                                        Row.width('100%');
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`地点: ${item.location || '未指定'}`);
                                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(192:21)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${item.start_time.substring(0, 16)} - ${item.end_time.substring(0, 16)}`);
                                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(193:21)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/EventSignup.ets(196:19)", "entry");
                                        Row.width('100%');
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`报名人数: ${this.signupCount[item.id] || 0}`);
                                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(197:21)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Button.createWithLabel('报名');
                                        Button.debugLine("entry/src/main/ets/pages/EventSignup.ets(198:21)", "entry");
                                        Button.width(80);
                                        Button.height(35);
                                        Button.onClick(() => {
                                            this.selectedEvent = item;
                                            // ======================
                                            // 【关键】打开弹窗时只加载本社团成员
                                            // ======================
                                            this.loadMembersByClubId(item.club_id);
                                            this.showSignupDialog = true;
                                        });
                                    }, Button);
                                    Button.pop();
                                    Row.pop();
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
                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(214:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#999');
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showSignupDialog && this.selectedEvent) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/EventSignup.ets(219:9)", "entry");
                        Column.position({ x: '10%', y: '30%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 15 });
                        Column.debugLine("entry/src/main/ets/pages/EventSignup.ets(220:11)", "entry");
                        Column.padding(20);
                        Column.width('80%');
                        Column.borderRadius(12);
                        Column.backgroundColor('#ffffff');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/EventSignup.ets(221:13)", "entry");
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceBetween);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('活动报名');
                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(222:15)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('×');
                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(223:15)", "entry");
                        Text.fontSize(20);
                        Text.width(30);
                        Text.height(30);
                        Text.borderRadius(15);
                        Text.backgroundColor('#f0f0f0');
                        Text.textAlign(TextAlign.Center);
                        Text.onClick(() => {
                            this.showSignupDialog = false;
                            this.selectedMemberId = '';
                        });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 15 });
                        Column.debugLine("entry/src/main/ets/pages/EventSignup.ets(231:13)", "entry");
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`活动: ${this.selectedEvent.title}`);
                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(232:15)", "entry");
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`时间: ${this.selectedEvent.start_time.substring(0, 16)} - ${this.selectedEvent.end_time.substring(0, 16)}`);
                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(233:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择成员');
                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(235:15)", "entry");
                        Text.fontSize(14);
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 5 });
                        List.debugLine("entry/src/main/ets/pages/EventSignup.ets(236:15)", "entry");
                        List.border({ width: 1, color: '#e0e0e0' });
                        List.borderRadius(6);
                        List.height(150);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const member = _item;
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
                                    ListItem.debugLine("entry/src/main/ets/pages/EventSignup.ets(238:19)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/pages/EventSignup.ets(239:21)", "entry");
                                        Row.padding(10);
                                        Row.width('100%');
                                        Row.height(50);
                                        Row.borderRadius(6);
                                        Row.backgroundColor(this.selectedMemberId === member.id.toString() ? '#e3f2fd' : '#f5f5f5');
                                        Row.onClick(() => {
                                            this.selectedMemberId = member.id.toString();
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${member.name} (${member.student_id})`);
                                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(240:23)", "entry");
                                        Text.fontSize(14);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (this.selectedMemberId === member.id.toString()) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('✓');
                                                    Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(242:25)", "entry");
                                                    Text.fontSize(16);
                                                    Text.fontColor('#2196f3');
                                                    Text.margin({ left: 10 });
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
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.allMembers, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/EventSignup.ets(254:13)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/EventSignup.ets(255:15)", "entry");
                        Button.width('45%');
                        Button.backgroundColor('#e0e0e0');
                        Button.onClick(() => {
                            this.showSignupDialog = false;
                            this.selectedMemberId = '';
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确认报名');
                        Button.debugLine("entry/src/main/ets/pages/EventSignup.ets(261:15)", "entry");
                        Button.width('45%');
                        Button.backgroundColor('#2196f3');
                        Button.fontColor('#fff');
                        Button.enabled(!!this.selectedMemberId);
                        Button.onClick(() => this.signupForEvent());
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.message);
                        Text.debugLine("entry/src/main/ets/pages/EventSignup.ets(270:9)", "entry");
                        Text.position({ x: '20%', y: '10%' });
                        Text.width('60%');
                        Text.height(50);
                        Text.backgroundColor('#333');
                        Text.fontColor('#fff');
                        Text.borderRadius(8);
                        Text.textAlign(TextAlign.Center);
                        Text.fontSize(14);
                        Text.onAppear(() => setTimeout(() => this.showMessage = false, 2000));
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
        return "EventSignupPage";
    }
}
registerNamedRoute(() => new EventSignupPage(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/EventSignup", pageFullPath: "entry/src/main/ets/pages/EventSignup", integratedHsp: "false", moduleType: "followWithHap" });
