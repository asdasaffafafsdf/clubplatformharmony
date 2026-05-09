if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Login_Params {
    username?: string;
    password?: string;
    errorMsg?: string;
    userType?: UserType;
    selectedIndex?: number[];
    tabOptions?: SegmentButtonOptions;
}
import router from "@ohos:router";
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
import { UserType } from "@normalized:N&&&entry/src/main/ets/types/index&";
import type { LoginReq, ApiResponse, User, MemberLoginReq } from "@normalized:N&&&entry/src/main/ets/types/index&";
import { SegmentButton } from "@ohos:arkui.advanced.SegmentButton";
import { SegmentButtonOptions } from "@ohos:arkui.advanced.SegmentButton";
class Login extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__userType = new ObservedPropertySimplePU(UserType.ADMIN, this, "userType");
        this.__selectedIndex = new ObservedPropertyObjectPU([0], this, "selectedIndex");
        this.__tabOptions = new ObservedPropertyObjectPU(SegmentButtonOptions.tab({
            buttons: [
                { text: '管理员登录' },
                { text: '成员登录' }
            ]
        }), this, "tabOptions");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Login_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.userType !== undefined) {
            this.userType = params.userType;
        }
        if (params.selectedIndex !== undefined) {
            this.selectedIndex = params.selectedIndex;
        }
        if (params.tabOptions !== undefined) {
            this.tabOptions = params.tabOptions;
        }
    }
    updateStateVars(params: Login_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__userType.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__tabOptions.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__userType.aboutToBeDeleted();
        this.__selectedIndex.aboutToBeDeleted();
        this.__tabOptions.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __userType: ObservedPropertySimplePU<UserType>;
    get userType() {
        return this.__userType.get();
    }
    set userType(newValue: UserType) {
        this.__userType.set(newValue);
    }
    private __selectedIndex: ObservedPropertyObjectPU<number[]>;
    get selectedIndex() {
        return this.__selectedIndex.get();
    }
    set selectedIndex(newValue: number[]) {
        this.__selectedIndex.set(newValue);
    }
    private __tabOptions: ObservedPropertyObjectPU<SegmentButtonOptions>;
    get tabOptions() {
        return this.__tabOptions.get();
    }
    set tabOptions(newValue: SegmentButtonOptions) {
        this.__tabOptions.set(newValue);
    }
    async login(): Promise<void> {
        if (!this.username || !this.password) {
            // this.errorMsg = '请输入完整信息'+this.selectedIndex
            if (this.selectedIndex[0] == 0) {
                this.errorMsg = '请输入完整信息';
            }
            else if (this.selectedIndex[0] == 1) {
                this.errorMsg = '请联系管理员为你添加账户';
            }
            return;
        }
        if (this.userType === UserType.ADMIN) {
            await this.adminLogin();
        }
        else {
            await this.memberLogin();
        }
    }
    async adminLogin(): Promise<void> {
        const reqData: LoginReq = {
            username: this.username,
            password: this.password
        };
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(Api.LOGIN, {
                    method: http.RequestMethod.POST,
                    header: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
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
            let result: ApiResponse<User>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string) as ApiResponse<User>;
            }
            else {
                result = res.result as ApiResponse<User>;
            }
            if (result.code === 0 && result.data) {
                AppStorage.SetOrCreate('user_info', result.data);
                AppStorage.SetOrCreate('user_type', UserType.ADMIN);
                router.replaceUrl({ url: 'pages/Home' });
                this.errorMsg = '';
            }
            else {
                this.errorMsg = result.msg || '登录失败';
            }
        }
        catch (error) {
            this.errorMsg = '网络错误，请重试';
        }
        finally {
            req.destroy();
        }
    }
    async memberLogin(): Promise<void> {
        const reqData: MemberLoginReq = {
            username: this.username,
            studentId: this.password
        };
        const req = http.createHttp();
        try {
            const res = await new Promise((resolve, reject) => {
                req.request(Api.MEMBER_LOGIN, {
                    method: http.RequestMethod.POST,
                    header: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
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
            let result: ApiResponse<User>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string) as ApiResponse<User>;
            }
            else {
                result = res.result as ApiResponse<User>;
            }
            if (result.code === 0 && result.data) {
                // ✅ 这里会把【姓名、社团账号、ID】全部存到全局
                AppStorage.SetOrCreate('user_info', result.data);
                AppStorage.SetOrCreate('user_type', UserType.MEMBER);
                router.replaceUrl({ url: 'pages/MemberHome' });
                this.errorMsg = '';
            }
            else {
                this.errorMsg = result.msg || '登录失败';
            }
        }
        catch (error) {
            this.errorMsg = '网络错误，请重试';
        }
        finally {
            req.destroy();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/pages/Login.ets(139:5)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录');
            Text.debugLine("entry/src/main/ets/pages/Login.ets(140:7)", "entry");
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.width('100%');
            __Common__.margin({ top: 20 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new SegmentButton(this, {
                        options: this.tabOptions,
                        selectedIndexes: this.__selectedIndex,
                        onItemClicked: (index: number) => {
                            this.selectedIndex = [index];
                            this.userType = index === 0 ? UserType.ADMIN : UserType.MEMBER;
                            this.username = '';
                            this.password = '';
                            this.errorMsg = '';
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Login.ets", line: 142, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            options: this.tabOptions,
                            selectedIndexes: this.selectedIndex,
                            onItemClicked: (index: number) => {
                                this.selectedIndex = [index];
                                this.userType = index === 0 ? UserType.ADMIN : UserType.MEMBER;
                                this.username = '';
                                this.password = '';
                                this.errorMsg = '';
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        options: this.tabOptions
                    });
                }
            }, { name: "SegmentButton" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.debugLine("entry/src/main/ets/pages/Login.ets(157:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#f44336');
                        Text.width('100%');
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
            TextInput.create({ placeholder: this.userType === UserType.ADMIN ? '用户名' : '姓名', text: this.username });
            TextInput.debugLine("entry/src/main/ets/pages/Login.ets(160:7)", "entry");
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
            TextInput.margin({ top: 10 });
            TextInput.onChange((val) => {
                this.username = val;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: this.userType === UserType.ADMIN ? '密码' : '社团账号',
                text: this.password
            });
            TextInput.debugLine("entry/src/main/ets/pages/Login.ets(169:7)", "entry");
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
            TextInput.margin({ top: 10 });
            TextInput.type(this.userType === UserType.ADMIN ? InputType.Password : InputType.Normal);
            TextInput.onChange((val) => {
                this.password = val;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('登录');
            Button.debugLine("entry/src/main/ets/pages/Login.ets(182:7)", "entry");
            Button.width('100%');
            Button.height(50);
            Button.margin({ top: 20 });
            Button.onClick(() => this.login());
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Login";
    }
}
registerNamedRoute(() => new Login(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/Login", pageFullPath: "entry/src/main/ets/pages/Login", integratedHsp: "false", moduleType: "followWithHap" });
