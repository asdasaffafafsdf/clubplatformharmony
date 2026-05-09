if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MemberHome_Params {
    userInfo?: UserInfo | undefined;
}
import router from "@ohos:router";
// 强类型定义
interface UserInfo {
    id: number;
    name: string;
    student_id: string;
    username?: string;
}
class MemberHome extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.userInfo = AppStorage.Get('user_info');
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MemberHome_Params) {
        if (params.userInfo !== undefined) {
            this.userInfo = params.userInfo;
        }
    }
    updateStateVars(params: MemberHome_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 从全局取出用户信息
    private userInfo: UserInfo | undefined;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/pages/MemberHome.ets(18:5)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('社团管理系统');
            Text.debugLine("entry/src/main/ets/pages/MemberHome.ets(19:7)", "entry");
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // ✅ 显示姓名 + 社团账号
            if (this.userInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`社团账号：${this.userInfo.student_id}`);
                        Text.debugLine("entry/src/main/ets/pages/MemberHome.ets(23:9)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#666');
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
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MemberHome.ets(28:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('加入活动');
            Button.debugLine("entry/src/main/ets/pages/MemberHome.ets(29:9)", "entry");
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/MemberEventSignup' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('活动签到');
            Button.debugLine("entry/src/main/ets/pages/MemberHome.ets(33:9)", "entry");
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/MemberCheckin' });
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('AI助手');
            Button.debugLine("entry/src/main/ets/pages/MemberHome.ets(38:7)", "entry");
            Button.width('90%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/Ai' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('退出登录');
            Button.debugLine("entry/src/main/ets/pages/MemberHome.ets(42:7)", "entry");
            Button.width('90%');
            Button.height(50);
            Button.backgroundColor('#ff6b6b');
            Button.margin({ top: 20 });
            Button.onClick(() => {
                router.replaceUrl({ url: 'pages/Login' });
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MemberHome";
    }
}
registerNamedRoute(() => new MemberHome(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/MemberHome", pageFullPath: "entry/src/main/ets/pages/MemberHome", integratedHsp: "false", moduleType: "followWithHap" });
