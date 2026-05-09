if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Members_Params {
    members?: Member[];
    allMembers?: Member[];
    newMemberName?: string;
    newStudentId?: string;
    newPhone?: string;
    newRole?: string;
    loading?: boolean;
    message?: string;
    selectedClubId?: number;
    clubs?: Club[];
    selectedClubName?: string;
    isDuplicate?: boolean;
    tip?: string;
}
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
import type { Member, AddMemberReq, ApiResponse, Club } from '../common/types';
class Members extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__members = new ObservedPropertyObjectPU([] // 显示用：当前社团成员
        , this, "members");
        this.__allMembers = new ObservedPropertyObjectPU([] // 查重用：全系统所有成员
        , this, "allMembers");
        this.__newMemberName = new ObservedPropertySimplePU('', this, "newMemberName");
        this.__newStudentId = new ObservedPropertySimplePU('', this, "newStudentId");
        this.__newPhone = new ObservedPropertySimplePU('', this, "newPhone");
        this.__newRole = new ObservedPropertySimplePU('member', this, "newRole");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__selectedClubId = new ObservedPropertySimplePU(1, this, "selectedClubId");
        this.__clubs = new ObservedPropertyObjectPU([], this, "clubs");
        this.__selectedClubName = new ObservedPropertySimplePU(AppStorage.Get<string>('selectedClubName') ?? ''
        // 全局重复提示
        , this, "selectedClubName");
        this.__isDuplicate = new ObservedPropertySimplePU(false, this, "isDuplicate");
        this.__tip = new ObservedPropertySimplePU('', this, "tip");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Members_Params) {
        if (params.members !== undefined) {
            this.members = params.members;
        }
        if (params.allMembers !== undefined) {
            this.allMembers = params.allMembers;
        }
        if (params.newMemberName !== undefined) {
            this.newMemberName = params.newMemberName;
        }
        if (params.newStudentId !== undefined) {
            this.newStudentId = params.newStudentId;
        }
        if (params.newPhone !== undefined) {
            this.newPhone = params.newPhone;
        }
        if (params.newRole !== undefined) {
            this.newRole = params.newRole;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.selectedClubId !== undefined) {
            this.selectedClubId = params.selectedClubId;
        }
        if (params.clubs !== undefined) {
            this.clubs = params.clubs;
        }
        if (params.selectedClubName !== undefined) {
            this.selectedClubName = params.selectedClubName;
        }
        if (params.isDuplicate !== undefined) {
            this.isDuplicate = params.isDuplicate;
        }
        if (params.tip !== undefined) {
            this.tip = params.tip;
        }
    }
    updateStateVars(params: Members_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__members.purgeDependencyOnElmtId(rmElmtId);
        this.__allMembers.purgeDependencyOnElmtId(rmElmtId);
        this.__newMemberName.purgeDependencyOnElmtId(rmElmtId);
        this.__newStudentId.purgeDependencyOnElmtId(rmElmtId);
        this.__newPhone.purgeDependencyOnElmtId(rmElmtId);
        this.__newRole.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedClubId.purgeDependencyOnElmtId(rmElmtId);
        this.__clubs.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedClubName.purgeDependencyOnElmtId(rmElmtId);
        this.__isDuplicate.purgeDependencyOnElmtId(rmElmtId);
        this.__tip.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__members.aboutToBeDeleted();
        this.__allMembers.aboutToBeDeleted();
        this.__newMemberName.aboutToBeDeleted();
        this.__newStudentId.aboutToBeDeleted();
        this.__newPhone.aboutToBeDeleted();
        this.__newRole.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__selectedClubId.aboutToBeDeleted();
        this.__clubs.aboutToBeDeleted();
        this.__selectedClubName.aboutToBeDeleted();
        this.__isDuplicate.aboutToBeDeleted();
        this.__tip.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __members: ObservedPropertyObjectPU<Member[]>; // 显示用：当前社团成员
    get members() {
        return this.__members.get();
    }
    set members(newValue: Member[]) {
        this.__members.set(newValue);
    }
    private __allMembers: ObservedPropertyObjectPU<Member[]>; // 查重用：全系统所有成员
    get allMembers() {
        return this.__allMembers.get();
    }
    set allMembers(newValue: Member[]) {
        this.__allMembers.set(newValue);
    }
    private __newMemberName: ObservedPropertySimplePU<string>;
    get newMemberName() {
        return this.__newMemberName.get();
    }
    set newMemberName(newValue: string) {
        this.__newMemberName.set(newValue);
    }
    private __newStudentId: ObservedPropertySimplePU<string>;
    get newStudentId() {
        return this.__newStudentId.get();
    }
    set newStudentId(newValue: string) {
        this.__newStudentId.set(newValue);
    }
    private __newPhone: ObservedPropertySimplePU<string>;
    get newPhone() {
        return this.__newPhone.get();
    }
    set newPhone(newValue: string) {
        this.__newPhone.set(newValue);
    }
    private __newRole: ObservedPropertySimplePU<string>;
    get newRole() {
        return this.__newRole.get();
    }
    set newRole(newValue: string) {
        this.__newRole.set(newValue);
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
    private __selectedClubId: ObservedPropertySimplePU<number>;
    get selectedClubId() {
        return this.__selectedClubId.get();
    }
    set selectedClubId(newValue: number) {
        this.__selectedClubId.set(newValue);
    }
    private __clubs: ObservedPropertyObjectPU<Club[]>;
    get clubs() {
        return this.__clubs.get();
    }
    set clubs(newValue: Club[]) {
        this.__clubs.set(newValue);
    }
    private __selectedClubName: ObservedPropertySimplePU<string>;
    get selectedClubName() {
        return this.__selectedClubName.get();
    }
    set selectedClubName(newValue: string) {
        this.__selectedClubName.set(newValue);
    }
    // 全局重复提示
    private __isDuplicate: ObservedPropertySimplePU<boolean>;
    get isDuplicate() {
        return this.__isDuplicate.get();
    }
    set isDuplicate(newValue: boolean) {
        this.__isDuplicate.set(newValue);
    }
    private __tip: ObservedPropertySimplePU<string>;
    get tip() {
        return this.__tip.get();
    }
    set tip(newValue: string) {
        this.__tip.set(newValue);
    }
    aboutToAppear() {
        this.loadClubs();
        this.loadMembers();
        this.loadAllMembers(); // 加载全系统成员（用于查重）
    }
    // 加载【全系统所有成员】只用于判断社团账号重复
    async loadAllMembers() {
        let req = http.createHttp();
        try {
            let res = await req.request(Api.MEMBERS, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' }
            });
            let result: ApiResponse<Member[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result);
            }
            else {
                result = { code: -1 } as ApiResponse<Member[]>;
            }
            if (result.code === 0 && result.data) {
                this.allMembers = result.data;
            }
        }
        finally {
            req.destroy();
        }
    }
    async loadClubs(): Promise<void> {
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(Api.CLUBS, {
                    method: http.RequestMethod.GET,
                    header: { 'Content-Type': 'application/json' }
                }, (err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            }) as http.HttpResponse;
            let result: ApiResponse<Club[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string);
            }
            else {
                result = { code: -1 } as ApiResponse<Club[]>;
            }
            if (result.code === 0 && Array.isArray(result.data)) {
                this.clubs = result.data;
                if (result.data.length > 0) {
                    this.selectedClubId = result.data[0].id;
                    this.selectedClubName = result.data[0].name;
                }
            }
        }
        finally {
            req.destroy();
        }
    }
    async loadMembers(): Promise<void> {
        this.loading = true;
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(`${Api.MEMBERS}?club_id=${this.selectedClubId}`, {
                    method: http.RequestMethod.GET,
                    header: { 'Content-Type': 'application/json' }
                }, (err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            }) as http.HttpResponse;
            let result: ApiResponse<Member[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string);
            }
            else {
                result = { code: -1 } as ApiResponse<Member[]>;
            }
            if (result.code === 0 && Array.isArray(result.data)) {
                this.members = result.data;
            }
        }
        finally {
            this.loading = false;
            req.destroy();
        }
    }
    // ==============================
    // 【全局查重】整个系统有就禁止
    // ==============================
    checkDuplicate() {
        if (!this.newStudentId) {
            this.isDuplicate = false;
            this.tip = '';
            return;
        }
        let exist = this.allMembers.some(m => m.student_id == this.newStudentId.trim());
        if (exist) {
            this.isDuplicate = true;
            this.tip = "该社团账号已在系统中存在，无法添加";
        }
        else {
            this.isDuplicate = false;
            this.tip = "";
        }
    }
    async addMember(): Promise<void> {
        if (this.isDuplicate) {
            this.message = "社团账号重复，请更换";
            return;
        }
        if (!this.newMemberName || !this.newStudentId) {
            this.message = "请填写必填项";
            return;
        }
        const reqData: AddMemberReq = {
            name: this.newMemberName,
            student_id: this.newStudentId,
            phone: this.newPhone,
            club_id: this.selectedClubId,
            role: this.newRole
        };
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(Api.MEMBERS, {
                    method: http.RequestMethod.POST,
                    header: { 'Content-Type': 'application/json' },
                    extraData: JSON.stringify(reqData)
                }, (err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            }) as http.HttpResponse;
            let result: ApiResponse<Member>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string);
            }
            else {
                result = { code: -1 } as ApiResponse<Member>;
            }
            if (result.code === 0) {
                this.loadMembers();
                this.loadAllMembers(); // 重新加载全系统成员
                this.newMemberName = '';
                this.newStudentId = '';
                this.newPhone = '';
                this.message = '添加成功';
                setTimeout(() => this.message = '', 2000);
            }
            else {
                this.message = result.msg || '添加失败';
            }
        }
        finally {
            req.destroy();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/pages/Members.ets(194:5)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('成员管理');
            Text.debugLine("entry/src/main/ets/pages/Members.ets(195:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Members.ets(197:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择社团: ');
            Text.debugLine("entry/src/main/ets/pages/Members.ets(198:9)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create(this.clubs.map(club => ({
                value: club.name,
                text: club.name
            } as SelectOption)));
            Select.debugLine("entry/src/main/ets/pages/Members.ets(199:9)", "entry");
            Select.selected(0);
            Select.onSelect((index: number) => {
                this.selectedClubId = this.clubs[index].id;
                this.selectedClubName = this.clubs[index].name;
                this.loadMembers();
            });
        }, Select);
        Select.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Members.ets(211:7)", "entry");
            Column.padding(15);
            Column.backgroundColor('#fff');
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('添加新成员');
            Text.debugLine("entry/src/main/ets/pages/Members.ets(212:9)", "entry");
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.debugLine("entry/src/main/ets/pages/Members.ets(213:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.debugLine("entry/src/main/ets/pages/Members.ets(214:11)", "entry");
            Text.fontSize(14);
        }, Text);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Span.create("姓名");
            Span.debugLine("entry/src/main/ets/pages/Members.ets(215:13)", "entry");
        }, Span);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Span.create("*");
            Span.debugLine("entry/src/main/ets/pages/Members.ets(216:13)", "entry");
            Span.fontColor(Color.Red);
        }, Span);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入姓名', text: this.newMemberName });
            TextInput.debugLine("entry/src/main/ets/pages/Members.ets(218:11)", "entry");
            TextInput.onChange(v => this.newMemberName = v);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.debugLine("entry/src/main/ets/pages/Members.ets(224:11)", "entry");
            Text.fontSize(14);
        }, Text);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Span.create("社团账号");
            Span.debugLine("entry/src/main/ets/pages/Members.ets(225:13)", "entry");
        }, Span);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Span.create("*");
            Span.debugLine("entry/src/main/ets/pages/Members.ets(226:13)", "entry");
            Span.fontColor(Color.Red);
        }, Span);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入社团账号', text: this.newStudentId });
            TextInput.debugLine("entry/src/main/ets/pages/Members.ets(228:11)", "entry");
            TextInput.onChange(v => {
                this.newStudentId = v;
                this.checkDuplicate();
            });
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isDuplicate) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.tip);
                        Text.debugLine("entry/src/main/ets/pages/Members.ets(238:13)", "entry");
                        Text.fontColor('#fff');
                        Text.backgroundColor('#f44336');
                        Text.padding(3);
                        Text.borderRadius(4);
                        Text.margin({ top: 4 });
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
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '电话', text: this.newPhone });
            TextInput.debugLine("entry/src/main/ets/pages/Members.ets(247:9)", "entry");
            TextInput.onChange(v => this.newPhone = v);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Members.ets(253:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('角色');
            Text.debugLine("entry/src/main/ets/pages/Members.ets(254:11)", "entry");
            Text.fontSize(14);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.newRole === 'admin' });
            Toggle.debugLine("entry/src/main/ets/pages/Members.ets(255:11)", "entry");
            Toggle.onChange(v => this.newRole = v ? 'admin' : 'member');
        }, Toggle);
        Toggle.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newRole === 'admin' ? '校内人员' : '校外人员');
            Text.debugLine("entry/src/main/ets/pages/Members.ets(257:11)", "entry");
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('添加成员');
            Button.debugLine("entry/src/main/ets/pages/Members.ets(260:9)", "entry");
            Button.width('100%');
            Button.enabled(!this.isDuplicate);
            Button.backgroundColor(this.isDuplicate ? '#ccc' : '#0070cc');
            Button.onClick(() => this.addMember());
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.message) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.message);
                        Text.debugLine("entry/src/main/ets/pages/Members.ets(271:9)", "entry");
                        Text.fontColor(this.message.includes('成功') ? '#4caf50' : '#f44336');
                    }, Text);
                    Text.pop();
                });
            }
            // 成员列表
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 成员列表
            Text.create('成员列表');
            Text.debugLine("entry/src/main/ets/pages/Members.ets(276:7)", "entry");
            // 成员列表
            Text.fontSize(18);
        }, Text);
        // 成员列表
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/Members.ets(278:9)", "entry");
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/Members.ets(280:9)", "entry");
                        Scroll.layoutWeight(1);
                        Scroll.width('100%');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 5 });
                        List.debugLine("entry/src/main/ets/pages/Members.ets(281:11)", "entry");
                        List.width('100%');
                        List.padding({ bottom: 10 });
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
                                    ListItem.debugLine("entry/src/main/ets/pages/Members.ets(283:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 15 });
                                        Row.debugLine("entry/src/main/ets/pages/Members.ets(284:17)", "entry");
                                        Row.padding(10);
                                        Row.backgroundColor('#fff');
                                        Row.borderRadius(8);
                                        Row.width('100%');
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 4 });
                                        Column.debugLine("entry/src/main/ets/pages/Members.ets(285:19)", "entry");
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.name);
                                        Text.debugLine("entry/src/main/ets/pages/Members.ets(286:21)", "entry");
                                        Text.fontSize(16);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`社团账号: ${item.student_id}`);
                                        Text.debugLine("entry/src/main/ets/pages/Members.ets(287:21)", "entry");
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`电话: ${item.phone || '未填写'}`);
                                        Text.debugLine("entry/src/main/ets/pages/Members.ets(288:21)", "entry");
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.role == 'admin' ? '校内人员' : '校外人员');
                                        Text.debugLine("entry/src/main/ets/pages/Members.ets(292:19)", "entry");
                                        Text.backgroundColor(item.role === 'admin' ? '#ff9800' : '#e0e0e0');
                                        Text.padding(5);
                                        Text.borderRadius(12);
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.members, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Members";
    }
}
interface SelectOption {
    value: string;
    text: string;
}
registerNamedRoute(() => new Members(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/Members", pageFullPath: "entry/src/main/ets/pages/Members", integratedHsp: "false", moduleType: "followWithHap" });
