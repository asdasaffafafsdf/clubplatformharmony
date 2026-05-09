if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Events_Params {
    events?: Event[];
    newEventTitle?: string;
    newEventContent?: string;
    newLocation?: string;
    newStartTime?: string;
    newEndTime?: string;
    newStatus?: string;
    loading?: boolean;
    message?: string;
    selectedClubId?: number;
    clubs?: Club[];
    showStartTimePicker?: boolean;
    showEndTimePicker?: boolean;
    startTimeDate?: Date;
    endTimeDate?: Date;
    selectedClubName?: string;
}
import type { AddEventReq, ApiResponse, Club, Event } from '../common/types';
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
class Events extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__events = new ObservedPropertyObjectPU([], this, "events");
        this.__newEventTitle = new ObservedPropertySimplePU('', this, "newEventTitle");
        this.__newEventContent = new ObservedPropertySimplePU('', this, "newEventContent");
        this.__newLocation = new ObservedPropertySimplePU('', this, "newLocation");
        this.__newStartTime = new ObservedPropertySimplePU('', this, "newStartTime");
        this.__newEndTime = new ObservedPropertySimplePU('', this, "newEndTime");
        this.__newStatus = new ObservedPropertySimplePU('published', this, "newStatus");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__selectedClubId = new ObservedPropertySimplePU(1 // 默认社团ID
        , this, "selectedClubId");
        this.__clubs = new ObservedPropertyObjectPU([], this, "clubs");
        this.__showStartTimePicker = new ObservedPropertySimplePU(false, this, "showStartTimePicker");
        this.__showEndTimePicker = new ObservedPropertySimplePU(false, this, "showEndTimePicker");
        this.__startTimeDate = new ObservedPropertyObjectPU(new Date(), this, "startTimeDate");
        this.__endTimeDate = new ObservedPropertyObjectPU(new Date(), this, "endTimeDate");
        this.__selectedClubName = new ObservedPropertySimplePU(AppStorage.Get<string>('selectedClubName') ?? '', this, "selectedClubName");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Events_Params) {
        if (params.events !== undefined) {
            this.events = params.events;
        }
        if (params.newEventTitle !== undefined) {
            this.newEventTitle = params.newEventTitle;
        }
        if (params.newEventContent !== undefined) {
            this.newEventContent = params.newEventContent;
        }
        if (params.newLocation !== undefined) {
            this.newLocation = params.newLocation;
        }
        if (params.newStartTime !== undefined) {
            this.newStartTime = params.newStartTime;
        }
        if (params.newEndTime !== undefined) {
            this.newEndTime = params.newEndTime;
        }
        if (params.newStatus !== undefined) {
            this.newStatus = params.newStatus;
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
        if (params.showStartTimePicker !== undefined) {
            this.showStartTimePicker = params.showStartTimePicker;
        }
        if (params.showEndTimePicker !== undefined) {
            this.showEndTimePicker = params.showEndTimePicker;
        }
        if (params.startTimeDate !== undefined) {
            this.startTimeDate = params.startTimeDate;
        }
        if (params.endTimeDate !== undefined) {
            this.endTimeDate = params.endTimeDate;
        }
        if (params.selectedClubName !== undefined) {
            this.selectedClubName = params.selectedClubName;
        }
    }
    updateStateVars(params: Events_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__events.purgeDependencyOnElmtId(rmElmtId);
        this.__newEventTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__newEventContent.purgeDependencyOnElmtId(rmElmtId);
        this.__newLocation.purgeDependencyOnElmtId(rmElmtId);
        this.__newStartTime.purgeDependencyOnElmtId(rmElmtId);
        this.__newEndTime.purgeDependencyOnElmtId(rmElmtId);
        this.__newStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedClubId.purgeDependencyOnElmtId(rmElmtId);
        this.__clubs.purgeDependencyOnElmtId(rmElmtId);
        this.__showStartTimePicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showEndTimePicker.purgeDependencyOnElmtId(rmElmtId);
        this.__startTimeDate.purgeDependencyOnElmtId(rmElmtId);
        this.__endTimeDate.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedClubName.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__events.aboutToBeDeleted();
        this.__newEventTitle.aboutToBeDeleted();
        this.__newEventContent.aboutToBeDeleted();
        this.__newLocation.aboutToBeDeleted();
        this.__newStartTime.aboutToBeDeleted();
        this.__newEndTime.aboutToBeDeleted();
        this.__newStatus.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__selectedClubId.aboutToBeDeleted();
        this.__clubs.aboutToBeDeleted();
        this.__showStartTimePicker.aboutToBeDeleted();
        this.__showEndTimePicker.aboutToBeDeleted();
        this.__startTimeDate.aboutToBeDeleted();
        this.__endTimeDate.aboutToBeDeleted();
        this.__selectedClubName.aboutToBeDeleted();
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
    private __newEventTitle: ObservedPropertySimplePU<string>;
    get newEventTitle() {
        return this.__newEventTitle.get();
    }
    set newEventTitle(newValue: string) {
        this.__newEventTitle.set(newValue);
    }
    private __newEventContent: ObservedPropertySimplePU<string>;
    get newEventContent() {
        return this.__newEventContent.get();
    }
    set newEventContent(newValue: string) {
        this.__newEventContent.set(newValue);
    }
    private __newLocation: ObservedPropertySimplePU<string>;
    get newLocation() {
        return this.__newLocation.get();
    }
    set newLocation(newValue: string) {
        this.__newLocation.set(newValue);
    }
    private __newStartTime: ObservedPropertySimplePU<string>;
    get newStartTime() {
        return this.__newStartTime.get();
    }
    set newStartTime(newValue: string) {
        this.__newStartTime.set(newValue);
    }
    private __newEndTime: ObservedPropertySimplePU<string>;
    get newEndTime() {
        return this.__newEndTime.get();
    }
    set newEndTime(newValue: string) {
        this.__newEndTime.set(newValue);
    }
    private __newStatus: ObservedPropertySimplePU<string>;
    get newStatus() {
        return this.__newStatus.get();
    }
    set newStatus(newValue: string) {
        this.__newStatus.set(newValue);
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
    private __selectedClubId: ObservedPropertySimplePU<number>; // 默认社团ID
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
    private __showStartTimePicker: ObservedPropertySimplePU<boolean>;
    get showStartTimePicker() {
        return this.__showStartTimePicker.get();
    }
    set showStartTimePicker(newValue: boolean) {
        this.__showStartTimePicker.set(newValue);
    }
    private __showEndTimePicker: ObservedPropertySimplePU<boolean>;
    get showEndTimePicker() {
        return this.__showEndTimePicker.get();
    }
    set showEndTimePicker(newValue: boolean) {
        this.__showEndTimePicker.set(newValue);
    }
    private __startTimeDate: ObservedPropertyObjectPU<Date>;
    get startTimeDate() {
        return this.__startTimeDate.get();
    }
    set startTimeDate(newValue: Date) {
        this.__startTimeDate.set(newValue);
    }
    private __endTimeDate: ObservedPropertyObjectPU<Date>;
    get endTimeDate() {
        return this.__endTimeDate.get();
    }
    set endTimeDate(newValue: Date) {
        this.__endTimeDate.set(newValue);
    }
    private __selectedClubName: ObservedPropertySimplePU<string>;
    get selectedClubName() {
        return this.__selectedClubName.get();
    }
    set selectedClubName(newValue: string) {
        this.__selectedClubName.set(newValue);
    }
    aboutToAppear() {
        this.loadClubs();
        this.loadEvents();
    }
    // 加载社团列表（修复版）
    async loadClubs(): Promise<void> {
        const httpRequest = http.createHttp();
        try {
            // 鸿蒙正确写法：url 单独第一个参数，options 第二个
            const response = await httpRequest.request(Api.CLUBS, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                }
            });
            // 明确解析类型
            let result: ApiResponse<Club[]>;
            if (typeof response.result === 'string') {
                result = JSON.parse(response.result);
            }
            else {
                result = response.result as ApiResponse<Club[]>;
            }
            if (result.code === 0) {
                this.clubs = result.data ?? [];
                if (this.clubs.length > 0) {
                    this.selectedClubId = this.clubs[0].id;
                    this.selectedClubName = this.clubs[0].name;
                }
            }
        }
        catch (error) {
            console.error('加载社团异常:', JSON.stringify(error));
        }
        finally {
            httpRequest.destroy();
        }
    }
    // 加载活动列表（修复版）
    async loadEvents(): Promise<void> {
        this.loading = true;
        const httpRequest = http.createHttp();
        try {
            const url = `${Api.EVENTS}?club_id=${this.selectedClubId}`;
            const response = await httpRequest.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                }
            });
            let result: ApiResponse<Event[]>;
            if (typeof response.result === 'string') {
                result = JSON.parse(response.result);
            }
            else {
                result = response.result as ApiResponse<Event[]>;
            }
            if (result.code === 0) {
                this.events = result.data ?? [];
            }
        }
        catch (error) {
            console.error('加载活动异常:', JSON.stringify(error));
        }
        finally {
            this.loading = false;
            httpRequest.destroy();
        }
    }
    async addEvent(): Promise<void> {
        if (!this.newEventTitle || !this.newStartTime || !this.newEndTime) {
            this.message = '请填写必填项';
            return;
        }
        // 格式化时间为字符串
        const startTimeStr = this.formatDateTime(this.startTimeDate);
        const endTimeStr = this.formatDateTime(this.endTimeDate);
        const reqData: AddEventReq = {
            title: this.newEventTitle,
            content: this.newEventContent,
            location: this.newLocation,
            start_time: startTimeStr,
            end_time: endTimeStr,
            club_id: this.selectedClubId,
            status: this.newStatus
        };
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(Api.EVENTS, {
                    method: http.RequestMethod.POST,
                    header: { 'Content-Type': 'application/json' },
                    extraData: JSON.stringify(reqData)
                }, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            }) as http.HttpResponse;
            let result: ApiResponse<Event>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string) as ApiResponse<Event>;
            }
            else {
                result = res.result as ApiResponse<Event>;
            }
            if (result.code === 0) {
                this.loadEvents();
                this.newEventTitle = '';
                this.newEventContent = '';
                this.newLocation = '';
                this.startTimeDate = new Date();
                this.endTimeDate = new Date();
                this.message = '发布成功';
                setTimeout(() => {
                    this.message = '';
                }, 2000);
            }
            else {
                this.message = result.msg || '发布失败';
            }
        }
        catch (error) {
            console.error('发布活动失败:', JSON.stringify(error));
            this.message = '网络错误，请重试';
        }
        finally {
            req.destroy();
        }
    }
    formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/pages/Event.ets(174:5)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('活动管理');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(175:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 选择社团
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Event.ets(178:7)", "entry");
            // 选择社团
            Row.width('100%');
            // 选择社团
            Row.padding({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择社团: ');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(179:9)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create(this.clubs.map((club): SelectOption => ({ value: club.name })));
            Select.debugLine("entry/src/main/ets/pages/Event.ets(180:9)", "entry");
            Select.selected(0);
            Select.onSelect((index: number) => {
                this.selectedClubId = this.clubs[index].id;
                this.selectedClubName = this.clubs[index].name;
                this.loadEvents();
            });
        }, Select);
        Select.pop();
        // 选择社团
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加活动表单
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Event.ets(191:7)", "entry");
            // 添加活动表单
            Column.padding(15);
            // 添加活动表单
            Column.borderRadius(8);
            // 添加活动表单
            Column.backgroundColor('#ffffff');
            // 添加活动表单
            Column.shadow({
                radius: 4,
                color: '#e0e0e0',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('发布新活动');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(192:9)", "entry");
            Text.fontSize(18);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '活动标题*', text: this.newEventTitle });
            TextInput.debugLine("entry/src/main/ets/pages/Event.ets(194:9)", "entry");
            TextInput.onChange(value => this.newEventTitle = value);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '活动描述', text: this.newEventContent });
            TextInput.debugLine("entry/src/main/ets/pages/Event.ets(200:9)", "entry");
            TextInput.onChange(value => this.newEventContent = value);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '活动地点', text: this.newLocation });
            TextInput.debugLine("entry/src/main/ets/pages/Event.ets(206:9)", "entry");
            TextInput.onChange(value => this.newLocation = value);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 开始时间选择
            // 开始时间选择
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Event.ets(214:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('开始时间*');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(215:11)", "entry");
            Text.fontSize(14);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Event.ets(216:11)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatDateTime(ObservedObject.GetRawObject(this.startTimeDate)));
            Text.debugLine("entry/src/main/ets/pages/Event.ets(217:13)", "entry");
            Text.fontSize(16);
            Text.borderRadius(8);
            Text.backgroundColor('#f5f5f5');
            Text.padding({ left: 10, right: 10 });
            Text.height(40);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('选择开始时间');
            Button.debugLine("entry/src/main/ets/pages/Event.ets(226:11)", "entry");
            Button.margin({ top: 5 });
            Button.onClick(() => {
                DatePickerDialog.show({
                    selected: this.startTimeDate,
                    onDateAccept: (date: Date) => {
                        const tempDate = new Date(this.startTimeDate.getTime());
                        // ✅ 修复：月份 +1
                        tempDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                        setTimeout(() => {
                            TimePickerDialog.show({
                                selected: tempDate,
                                useMilitaryTime: true,
                                onAccept: (time: TimePickerResult) => {
                                    const finalSecond = (tempDate.getSeconds() + 1) % 60;
                                    tempDate.setHours(time.hour, time.minute, finalSecond);
                                    this.startTimeDate = tempDate;
                                }
                            });
                        }, 1000);
                    }
                });
            });
        }, Button);
        Button.pop();
        // 开始时间选择
        // 开始时间选择
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 结束时间选择
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Event.ets(251:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('结束时间*');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(252:11)", "entry");
            Text.fontSize(14);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Event.ets(253:11)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatDateTime(ObservedObject.GetRawObject(this.endTimeDate)));
            Text.debugLine("entry/src/main/ets/pages/Event.ets(254:13)", "entry");
            Text.fontSize(16);
            Text.borderRadius(8);
            Text.backgroundColor('#f5f5f5');
            Text.padding({ left: 10, right: 10 });
            Text.height(40);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('选择结束时间');
            Button.debugLine("entry/src/main/ets/pages/Event.ets(263:11)", "entry");
            Button.margin({ top: 5 });
            Button.onClick(() => {
                DatePickerDialog.show({
                    selected: this.endTimeDate,
                    onDateAccept: (date: Date) => {
                        const tempDate = new Date(this.endTimeDate.getTime());
                        // ✅ 修复：月份 +1
                        tempDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                        setTimeout(() => {
                            TimePickerDialog.show({
                                selected: tempDate,
                                useMilitaryTime: true,
                                onAccept: (time: TimePickerResult) => {
                                    const finalSecond = (tempDate.getSeconds() + 1) % 60;
                                    tempDate.setHours(time.hour, time.minute, finalSecond);
                                    this.endTimeDate = tempDate;
                                }
                            });
                        }, 1000);
                    }
                });
            });
        }, Button);
        Button.pop();
        // 结束时间选择
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Event.ets(287:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('状态');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(288:11)", "entry");
            Text.fontSize(14);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.newStatus === 'draft' });
            Toggle.debugLine("entry/src/main/ets/pages/Event.ets(289:11)", "entry");
            Toggle.onChange((value: boolean) => {
                this.newStatus = value ? 'draft' : 'published';
            });
        }, Toggle);
        Toggle.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newStatus === 'draft' ? '草稿' : '已发布');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(293:11)", "entry");
            Text.fontSize(14);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发布活动');
            Button.debugLine("entry/src/main/ets/pages/Event.ets(296:9)", "entry");
            Button.width('100%');
            Button.onClick(() => this.addEvent());
        }, Button);
        Button.pop();
        // 添加活动表单
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.message) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.message);
                        Text.debugLine("entry/src/main/ets/pages/Event.ets(305:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(this.message.includes('成功') ? '#4caf50' : '#f44336');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                });
            }
            // 活动列表
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 活动列表
            Text.create('活动列表');
            Text.debugLine("entry/src/main/ets/pages/Event.ets(310:7)", "entry");
            // 活动列表
            Text.fontSize(18);
            // 活动列表
            Text.alignSelf(ItemAlign.Start);
            // 活动列表
            Text.margin({ top: 10 });
        }, Text);
        // 活动列表
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/Event.ets(313:9)", "entry");
                        Text.fontSize(16);
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 5 });
                        List.debugLine("entry/src/main/ets/pages/Event.ets(315:9)", "entry");
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
                                    ListItem.debugLine("entry/src/main/ets/pages/Event.ets(317:13)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 8 });
                                        Column.debugLine("entry/src/main/ets/pages/Event.ets(318:15)", "entry");
                                        Column.padding(10);
                                        Column.width('100%');
                                        Column.height(120);
                                        Column.borderRadius(8);
                                        Column.backgroundColor('#ffffff');
                                        Column.shadow({
                                            radius: 4,
                                            color: '#e0e0e0',
                                            offsetX: 0,
                                            offsetY: 2
                                        });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.title);
                                        Text.debugLine("entry/src/main/ets/pages/Event.ets(319:17)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.content || '无描述');
                                        Text.debugLine("entry/src/main/ets/pages/Event.ets(320:17)", "entry");
                                        Text.fontSize(14);
                                        Text.maxLines(2);
                                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/Event.ets(322:17)", "entry");
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`地点: ${item.location || '未指定'}`);
                                        Text.debugLine("entry/src/main/ets/pages/Event.ets(323:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${item.start_time.substring(0, 16)} - ${item.end_time.substring(0, 16)}`);
                                        Text.debugLine("entry/src/main/ets/pages/Event.ets(324:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666');
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/pages/Event.ets(327:17)", "entry");
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.status);
                                        Text.debugLine("entry/src/main/ets/pages/Event.ets(328:19)", "entry");
                                        Text.fontSize(12);
                                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                                        Text.backgroundColor(item.status === 'published' ? '#4caf50' : '#ff9800');
                                        Text.fontColor('#fff');
                                        Text.borderRadius(6);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.created_at ? item.created_at.substring(0, 10) : '');
                                        Text.debugLine("entry/src/main/ets/pages/Event.ets(332:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#999');
                                    }, Text);
                                    Text.pop();
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
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Events";
    }
}
registerNamedRoute(() => new Events(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/Event", pageFullPath: "entry/src/main/ets/pages/Event", integratedHsp: "false", moduleType: "followWithHap" });
