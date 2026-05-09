if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Clubs_Params {
    clubs?: Club[];
    newClubName?: string;
    newDescription?: string;
    loading?: boolean;
    message?: string;
}
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
import type { Club, AddClubReq, ApiResponse } from '../common/types';
class Clubs extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__clubs = new ObservedPropertyObjectPU([], this, "clubs");
        this.__newClubName = new ObservedPropertySimplePU('', this, "newClubName");
        this.__newDescription = new ObservedPropertySimplePU('', this, "newDescription");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Clubs_Params) {
        if (params.clubs !== undefined) {
            this.clubs = params.clubs;
        }
        if (params.newClubName !== undefined) {
            this.newClubName = params.newClubName;
        }
        if (params.newDescription !== undefined) {
            this.newDescription = params.newDescription;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.message !== undefined) {
            this.message = params.message;
        }
    }
    updateStateVars(params: Clubs_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__clubs.purgeDependencyOnElmtId(rmElmtId);
        this.__newClubName.purgeDependencyOnElmtId(rmElmtId);
        this.__newDescription.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__clubs.aboutToBeDeleted();
        this.__newClubName.aboutToBeDeleted();
        this.__newDescription.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __clubs: ObservedPropertyObjectPU<Club[]>;
    get clubs() {
        return this.__clubs.get();
    }
    set clubs(newValue: Club[]) {
        this.__clubs.set(newValue);
    }
    private __newClubName: ObservedPropertySimplePU<string>;
    get newClubName() {
        return this.__newClubName.get();
    }
    set newClubName(newValue: string) {
        this.__newClubName.set(newValue);
    }
    private __newDescription: ObservedPropertySimplePU<string>;
    get newDescription() {
        return this.__newDescription.get();
    }
    set newDescription(newValue: string) {
        this.__newDescription.set(newValue);
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
    aboutToAppear() {
        this.loadClubs();
    }
    async loadClubs(): Promise<void> {
        this.loading = true;
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(Api.CLUBS, {
                    method: http.RequestMethod.GET,
                    header: { 'Content-Type': 'application/json' }
                }, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            }) as http.HttpResponse;
            let result: ApiResponse<Club[]>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string) as ApiResponse<Club[]>;
            }
            else {
                result = res.result as ApiResponse<Club[]>;
            }
            if (result.code === 0 && Array.isArray(result.data)) {
                this.clubs = result.data;
            }
            else {
                this.message = result.msg || '加载社团失败';
            }
        }
        catch (error) {
            console.error('加载社团失败:', JSON.stringify(error));
            this.message = '网络错误，请重试';
        }
        finally {
            this.loading = false;
            req.destroy();
        }
    }
    async addClub(): Promise<void> {
        if (!this.newClubName) {
            this.message = '请输入社团名称';
            return;
        }
        const reqData: AddClubReq = {
            name: this.newClubName,
            description: this.newDescription
        };
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(Api.CLUBS, {
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
            let result: ApiResponse<Club>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string) as ApiResponse<Club>;
            }
            else {
                result = res.result as ApiResponse<Club>;
            }
            if (result.code === 0) {
                this.loadClubs();
                this.newClubName = '';
                this.newDescription = '';
                this.message = '创建成功';
                setTimeout(() => {
                    this.message = '';
                }, 2000);
            }
            else {
                this.message = result.msg || '创建失败';
            }
        }
        catch (error) {
            console.error('创建社团失败:', JSON.stringify(error));
            this.message = '网络错误，请重试';
        }
        finally {
            req.destroy();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/pages/Clubs.ets(113:5)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('社团管理');
            Text.debugLine("entry/src/main/ets/pages/Clubs.ets(114:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 创建社团表单
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Clubs.ets(117:7)", "entry");
            // 创建社团表单
            Column.padding(15);
            // 创建社团表单
            Column.borderRadius(8);
            // 创建社团表单
            Column.backgroundColor('#ffffff');
            // 创建社团表单
            Column.shadow({
                radius: 4,
                color: '#e0e0e0',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建新社团');
            Text.debugLine("entry/src/main/ets/pages/Clubs.ets(118:9)", "entry");
            Text.fontSize(18);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Clubs.ets(120:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.debugLine("entry/src/main/ets/pages/Clubs.ets(121:11)", "entry");
            Text.fontSize(14);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Span.create("社团名称");
            Span.debugLine("entry/src/main/ets/pages/Clubs.ets(122:13)", "entry");
        }, Span);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Span.create("*");
            Span.debugLine("entry/src/main/ets/pages/Clubs.ets(124:13)", "entry");
            Span.fontColor(Color.Red);
        }, Span);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入社团名称', text: this.newClubName });
            TextInput.debugLine("entry/src/main/ets/pages/Clubs.ets(127:11)", "entry");
            TextInput.onChange(value => this.newClubName = value);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Clubs.ets(134:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('社团描述');
            Text.debugLine("entry/src/main/ets/pages/Clubs.ets(135:11)", "entry");
            Text.fontSize(14);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入社团描述', text: this.newDescription });
            TextInput.debugLine("entry/src/main/ets/pages/Clubs.ets(136:11)", "entry");
            TextInput.onChange(value => this.newDescription = value);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('创建社团');
            Button.debugLine("entry/src/main/ets/pages/Clubs.ets(143:9)", "entry");
            Button.width('100%');
            Button.onClick(() => this.addClub());
        }, Button);
        Button.pop();
        // 创建社团表单
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.message) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.message);
                        Text.debugLine("entry/src/main/ets/pages/Clubs.ets(152:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(this.message.includes('成功') ? '#4caf50' : '#f44336');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                });
            }
            // 社团列表
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 社团列表
            Text.create('社团列表');
            Text.debugLine("entry/src/main/ets/pages/Clubs.ets(157:7)", "entry");
            // 社团列表
            Text.fontSize(18);
            // 社团列表
            Text.alignSelf(ItemAlign.Start);
            // 社团列表
            Text.margin({ top: 1 });
        }, Text);
        // 社团列表
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/Clubs.ets(160:9)", "entry");
                        Text.fontSize(16);
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Scroll(){
                        List.create({ space: 5 });
                        List.debugLine("entry/src/main/ets/pages/Clubs.ets(163:10)", "entry");
                        // Scroll(){
                        List.padding({ top: 1 });
                        // Scroll(){
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
                                    ListItem.debugLine("entry/src/main/ets/pages/Clubs.ets(165:14)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 8 });
                                        Column.debugLine("entry/src/main/ets/pages/Clubs.ets(166:16)", "entry");
                                        Column.padding(10);
                                        Column.width('100%');
                                        Column.height(80);
                                        Column.borderRadius(8);
                                        Column.backgroundColor('#ffffff');
                                        Column.shadow({
                                            radius: 4,
                                            color: '#e0e0e0',
                                            offsetX: 0,
                                            offsetY: 2
                                        });
                                        Column.onClick(() => {
                                            // 可以跳转到社团详情页或设置当前选中的社团
                                            AppStorage.SetOrCreate('currentClubId', item.id);
                                            this.message = `已选择社团: ${item.name}`;
                                            setTimeout(() => {
                                                this.message = '';
                                            }, 2000);
                                        });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.name);
                                        Text.debugLine("entry/src/main/ets/pages/Clubs.ets(167:18)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.description) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.description);
                                                    Text.debugLine("entry/src/main/ets/pages/Clubs.ets(169:20)", "entry");
                                                    Text.fontSize(14);
                                                    Text.maxLines(2);
                                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
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
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`创建于: ${item.created_at ? item.created_at.substring(0, 10) : ''}`);
                                        Text.debugLine("entry/src/main/ets/pages/Clubs.ets(171:18)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#999');
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.clubs, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // Scroll(){
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
        return "Clubs";
    }
}
registerNamedRoute(() => new Clubs(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/Clubs", pageFullPath: "entry/src/main/ets/pages/Clubs", integratedHsp: "false", moduleType: "followWithHap" });
