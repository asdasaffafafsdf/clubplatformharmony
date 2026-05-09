if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CheckIn_Params {
    signups?: EventSignup[];
    loading?: boolean;
    message?: string;
    showMessage?: boolean;
    selectedSignup?: EventSignup | null;
    showCheckInDialog?: boolean;
    totalCount?: number;
    checkedInCount?: number;
    notCheckedInCount?: number;
}
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
import type { EventSignup, CheckInReq, ApiResponse } from '../common/types';
class CheckIn extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__signups = new ObservedPropertyObjectPU([], this, "signups");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__showMessage = new ObservedPropertySimplePU(false, this, "showMessage");
        this.__selectedSignup = new ObservedPropertyObjectPU(null, this, "selectedSignup");
        this.__showCheckInDialog = new ObservedPropertySimplePU(false
        // ##############################
        // 只有这里新增 3 个状态（最简单）
        // ##############################
        , this, "showCheckInDialog");
        this.__totalCount = new ObservedPropertySimplePU(0, this, "totalCount");
        this.__checkedInCount = new ObservedPropertySimplePU(0, this, "checkedInCount");
        this.__notCheckedInCount = new ObservedPropertySimplePU(0, this, "notCheckedInCount");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CheckIn_Params) {
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
        if (params.selectedSignup !== undefined) {
            this.selectedSignup = params.selectedSignup;
        }
        if (params.showCheckInDialog !== undefined) {
            this.showCheckInDialog = params.showCheckInDialog;
        }
        if (params.totalCount !== undefined) {
            this.totalCount = params.totalCount;
        }
        if (params.checkedInCount !== undefined) {
            this.checkedInCount = params.checkedInCount;
        }
        if (params.notCheckedInCount !== undefined) {
            this.notCheckedInCount = params.notCheckedInCount;
        }
    }
    updateStateVars(params: CheckIn_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__signups.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__showMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedSignup.purgeDependencyOnElmtId(rmElmtId);
        this.__showCheckInDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__totalCount.purgeDependencyOnElmtId(rmElmtId);
        this.__checkedInCount.purgeDependencyOnElmtId(rmElmtId);
        this.__notCheckedInCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__signups.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__showMessage.aboutToBeDeleted();
        this.__selectedSignup.aboutToBeDeleted();
        this.__showCheckInDialog.aboutToBeDeleted();
        this.__totalCount.aboutToBeDeleted();
        this.__checkedInCount.aboutToBeDeleted();
        this.__notCheckedInCount.aboutToBeDeleted();
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
    private __selectedSignup: ObservedPropertyObjectPU<EventSignup | null>;
    get selectedSignup() {
        return this.__selectedSignup.get();
    }
    set selectedSignup(newValue: EventSignup | null) {
        this.__selectedSignup.set(newValue);
    }
    private __showCheckInDialog: ObservedPropertySimplePU<boolean>;
    get showCheckInDialog() {
        return this.__showCheckInDialog.get();
    }
    set showCheckInDialog(newValue: boolean) {
        this.__showCheckInDialog.set(newValue);
    }
    // ##############################
    // 只有这里新增 3 个状态（最简单）
    // ##############################
    private __totalCount: ObservedPropertySimplePU<number>;
    get totalCount() {
        return this.__totalCount.get();
    }
    set totalCount(newValue: number) {
        this.__totalCount.set(newValue);
    }
    private __checkedInCount: ObservedPropertySimplePU<number>;
    get checkedInCount() {
        return this.__checkedInCount.get();
    }
    set checkedInCount(newValue: number) {
        this.__checkedInCount.set(newValue);
    }
    private __notCheckedInCount: ObservedPropertySimplePU<number>;
    get notCheckedInCount() {
        return this.__notCheckedInCount.get();
    }
    set notCheckedInCount(newValue: number) {
        this.__notCheckedInCount.set(newValue);
    }
    aboutToAppear() {
        this.loadAllSignups();
    }
    // ##############################
    // 只有这里新增一个计算方法（只算checkin_status）
    // ##############################
    updateStats() {
        let total = this.signups.length;
        let checked = 0;
        let unchecked = 0;
        for (let s of this.signups) {
            if (s.checkin_status === 1) {
                checked++;
            }
            else {
                unchecked++;
            }
        }
        this.totalCount = total;
        this.checkedInCount = checked;
        this.notCheckedInCount = unchecked;
    }
    async loadAllSignups(): Promise<void> {
        this.loading = true;
        const req = http.createHttp();
        try {
            const res = await req.request(`${Api.BASE_URL}/event_signups_all`, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' }
            });
            let result: ApiResponse<EventSignup[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result) as ApiResponse<EventSignup[]>;
            }
            else {
                result = res.result as ApiResponse<EventSignup[]>;
            }
            if (result.code === 0) {
                this.signups = result.data || [];
                // 加载完成 → 计算
                this.updateStats();
            }
            else {
                this.showMessage = true;
                this.message = result.msg || '加载报名信息失败';
            }
        }
        catch (error) {
            console.error('加载报名信息失败:', error);
            this.showMessage = true;
            this.message = '网络错误，请重试';
        }
        finally {
            this.loading = false;
            req.destroy();
        }
    }
    async performCheckIn(eventId: number, memberId: number): Promise<void> {
        const reqData: CheckInReq = {
            event_id: eventId,
            member_id: memberId
        };
        const req = http.createHttp();
        try {
            const res = await req.request(Api.CHECKIN, {
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
                this.message = result.msg || '签到成功';
                this.signups = this.signups.map(signup => {
                    if (signup.event_id === eventId && signup.member_id === memberId) {
                        return {
                            event_id: signup.event_id,
                            member_id: signup.member_id,
                            name: signup.name,
                            student_id: signup.student_id,
                            title: signup.title,
                            sign_up_time: signup.sign_up_time,
                            checkin_status: 1,
                            checkin_time: new Date().toISOString().substring(0, 19).replace('T', ' ')
                        };
                    }
                    return signup;
                });
                // 签到完成 → 重新计算
                this.updateStats();
                this.showCheckInDialog = false;
            }
            else {
                this.showMessage = true;
                this.message = result.msg || '签到失败';
            }
        }
        catch (error) {
            console.error('签到失败:', error);
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
            Stack.debugLine("entry/src/main/ets/pages/CheckIn.ets(140:5)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(141:7)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('现场签到');
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(142:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.alignSelf(ItemAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ##############################
            // UI 直接读取 3 个数字
            // ##############################
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/CheckIn.ets(147:9)", "entry");
            // ##############################
            // UI 直接读取 3 个数字
            // ##############################
            Row.width('100%');
            // ##############################
            // UI 直接读取 3 个数字
            // ##############################
            Row.margin({ top: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(148:11)", "entry");
            Column.flexGrow(1);
            Column.padding(10);
            Column.backgroundColor('#f5f7fa');
            Column.borderRadius(10);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('总共');
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(149:13)", "entry");
            Text.fontSize(12);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.totalCount.toString());
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(150:13)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(157:11)", "entry");
            Column.flexGrow(1);
            Column.padding(10);
            Column.backgroundColor('#4caf50');
            Column.borderRadius(10);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已签到');
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(158:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#fff');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.checkedInCount.toString());
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(159:13)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(166:11)", "entry");
            Column.flexGrow(1);
            Column.padding(10);
            Column.backgroundColor('#ff9800');
            Column.borderRadius(10);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('未签到');
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(167:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#fff');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.notCheckedInCount.toString());
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(168:13)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
        // ##############################
        // UI 直接读取 3 个数字
        // ##############################
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('待签到列表');
            Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(178:9)", "entry");
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
                        LoadingProgress.debugLine("entry/src/main/ets/pages/CheckIn.ets(181:11)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.margin({ top: 20 });
                    }, LoadingProgress);
                });
            }
            else if (this.signups.length > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 5 });
                        List.debugLine("entry/src/main/ets/pages/CheckIn.ets(183:11)", "entry");
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
                                    ListItem.debugLine("entry/src/main/ets/pages/CheckIn.ets(185:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 8 });
                                        Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(186:17)", "entry");
                                        Column.padding(10);
                                        Column.width('100%');
                                        Column.height(120);
                                        Column.borderRadius(8);
                                        Column.backgroundColor('#ffffff');
                                        Column.shadow({ radius: 4, color: '#e0e0e0', offsetX: 0, offsetY: 2 });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/CheckIn.ets(187:19)", "entry");
                                        Row.width('100%');
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.name);
                                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(188:21)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.checkin_status === 1) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('已签到');
                                                    Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(190:23)", "entry");
                                                    Text.fontSize(12);
                                                    Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                                                    Text.backgroundColor('#4caf50');
                                                    Text.fontColor('#fff');
                                                    Text.borderRadius(6);
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('未签到');
                                                    Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(193:23)", "entry");
                                                    Text.fontSize(12);
                                                    Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                                                    Text.backgroundColor('#ff9800');
                                                    Text.fontColor('#fff');
                                                    Text.borderRadius(6);
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${item.title} - 社团账号: ${item.student_id}`);
                                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(198:19)", "entry");
                                        Text.fontSize(14);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/CheckIn.ets(200:19)", "entry");
                                        Row.width('100%');
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`报名时间: ${item.sign_up_time.substring(0, 16)}`);
                                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(201:21)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#999');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.checkin_time) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`签到: ${item.checkin_time.substring(0, 16)}`);
                                                    Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(203:23)", "entry");
                                                    Text.fontSize(12);
                                                    Text.fontColor('#999');
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
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.checkin_status !== 1) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithLabel('执行签到');
                                                    Button.debugLine("entry/src/main/ets/pages/CheckIn.ets(208:21)", "entry");
                                                    Button.width('100%');
                                                    Button.onClick(() => {
                                                        this.selectedSignup = item;
                                                        this.showCheckInDialog = true;
                                                    });
                                                }, Button);
                                                Button.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('已完成签到');
                                                    Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(215:21)", "entry");
                                                    Text.fontSize(12);
                                                    Text.fontColor('#4caf50');
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
                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(223:11)", "entry");
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
            if (this.showCheckInDialog && this.selectedSignup) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(228:9)", "entry");
                        Column.position({ x: '10%', y: '30%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 15 });
                        Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(229:11)", "entry");
                        Column.padding(20);
                        Column.width('80%');
                        Column.borderRadius(12);
                        Column.backgroundColor('#fff');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CheckIn.ets(230:13)", "entry");
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceBetween);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('确认签到');
                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(231:15)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('×');
                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(232:15)", "entry");
                        Text.fontSize(20);
                        Text.width(30);
                        Text.height(30);
                        Text.borderRadius(15);
                        Text.backgroundColor('#f0f0f0');
                        Text.textAlign(TextAlign.Center);
                        Text.onClick(() => this.showCheckInDialog = false);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.debugLine("entry/src/main/ets/pages/CheckIn.ets(237:13)", "entry");
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`成员: ${this.selectedSignup.name}`);
                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(238:15)", "entry");
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`活动: ${this.selectedSignup.title}`);
                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(239:15)", "entry");
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`社团账号: ${this.selectedSignup.student_id}`);
                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(240:15)", "entry");
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/CheckIn.ets(243:13)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/CheckIn.ets(244:15)", "entry");
                        Button.width('45%');
                        Button.backgroundColor('#e0e0e0');
                        Button.onClick(() => this.showCheckInDialog = false);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确认签到');
                        Button.debugLine("entry/src/main/ets/pages/CheckIn.ets(246:15)", "entry");
                        Button.width('45%');
                        Button.backgroundColor('#2196f3');
                        Button.fontColor('#fff');
                        Button.onClick(() => {
                            if (this.selectedSignup) {
                                this.performCheckIn(this.selectedSignup.event_id, this.selectedSignup.member_id);
                            }
                        });
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
                        Text.debugLine("entry/src/main/ets/pages/CheckIn.ets(258:9)", "entry");
                        Text.position({ x: '20%', y: '10%' });
                        Text.width('60%');
                        Text.height(50);
                        Text.backgroundColor('#333');
                        Text.fontColor('#fff');
                        Text.borderRadius(8);
                        Text.textAlign(TextAlign.Center);
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
        return "CheckIn";
    }
}
registerNamedRoute(() => new CheckIn(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/CheckIn", pageFullPath: "entry/src/main/ets/pages/CheckIn", integratedHsp: "false", moduleType: "followWithHap" });
