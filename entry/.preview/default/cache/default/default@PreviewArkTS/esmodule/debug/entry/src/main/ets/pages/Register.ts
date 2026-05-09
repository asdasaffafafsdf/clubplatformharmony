if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Register_Params {
    username?: string;
    password?: string;
    confirmPassword?: string;
    errorMsg?: string;
    successMsg?: string;
}
import router from "@ohos:router";
import http from "@ohos:net.http";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
import type { RegisterReq, ApiResponse } from '../common/types';
class Register extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__successMsg = new ObservedPropertySimplePU('', this, "successMsg");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Register_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.successMsg !== undefined) {
            this.successMsg = params.successMsg;
        }
    }
    updateStateVars(params: Register_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__successMsg.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__successMsg.aboutToBeDeleted();
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
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __successMsg: ObservedPropertySimplePU<string>;
    get successMsg() {
        return this.__successMsg.get();
    }
    set successMsg(newValue: string) {
        this.__successMsg.set(newValue);
    }
    async register(): Promise<void> {
        if (!this.username || !this.password) {
            this.errorMsg = '请输入用户名和密码';
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.errorMsg = '两次输入的密码不一致';
            return;
        }
        const reqData: RegisterReq = {
            username: this.username,
            password: this.password
        };
        const req = http.createHttp();
        try {
            // 直接传入URL字符串
            const res = await new Promise((resolve, reject) => {
                req.request(Api.REGISTER, {
                    method: http.RequestMethod.POST,
                    header: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    //content: JSON.stringify(reqData)
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
            console.info('Register response:', JSON.stringify(res));
            let result: ApiResponse<void>;
            if (typeof res.result === 'string') {
                result = JSON.parse(res.result as string) as ApiResponse<void>;
            }
            else {
                result = res.result as ApiResponse<void>;
            }
            if (result.code === 0) {
                this.successMsg = result.msg || '注册成功';
                this.errorMsg = '';
                setTimeout(() => {
                    router.back();
                }, 1500);
            }
            else {
                this.errorMsg = result.msg || '注册失败';
                this.successMsg = '';
            }
        }
        catch (error) {
            this.errorMsg = '网络错误，请重试';
            console.error('Register error:', JSON.stringify(error));
        }
        finally {
            req.destroy();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/pages/Register.ets(82:5)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('注册');
            Text.debugLine("entry/src/main/ets/pages/Register.ets(83:7)", "entry");
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.debugLine("entry/src/main/ets/pages/Register.ets(86:9)", "entry");
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
            If.create();
            if (this.successMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.successMsg);
                        Text.debugLine("entry/src/main/ets/pages/Register.ets(90:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#4caf50');
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
            TextInput.create({ placeholder: '用户名', text: this.username });
            TextInput.debugLine("entry/src/main/ets/pages/Register.ets(93:7)", "entry");
            TextInput.onChange(v => this.username = v);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
            TextInput.margin({ top: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '密码', text: this.password });
            TextInput.debugLine("entry/src/main/ets/pages/Register.ets(100:7)", "entry");
            TextInput.type(InputType.Password);
            TextInput.onChange(v => this.password = v);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
            TextInput.margin({ top: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '确认密码', text: this.confirmPassword });
            TextInput.debugLine("entry/src/main/ets/pages/Register.ets(108:7)", "entry");
            TextInput.type(InputType.Password);
            TextInput.onChange(v => this.confirmPassword = v);
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
            TextInput.padding({ left: 10, right: 10 });
            TextInput.margin({ top: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('注册');
            Button.debugLine("entry/src/main/ets/pages/Register.ets(116:7)", "entry");
            Button.width('100%');
            Button.height(50);
            Button.margin({ top: 20 });
            Button.onClick(() => this.register());
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Register";
    }
}
registerNamedRoute(() => new Register(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/Register", pageFullPath: "entry/src/main/ets/pages/Register", integratedHsp: "false", moduleType: "followWithHap" });
