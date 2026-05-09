if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Home_Params {
}
import router from "@ohos:router";
class Home extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Home_Params) {
    }
    updateStateVars(params: Home_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/pages/Home.ets(8:5)", "entry");
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('社团管理系统');
            Text.debugLine("entry/src/main/ets/pages/Home.ets(9:7)", "entry");
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Home.ets(11:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('成员管理');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(12:9)", "entry");
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/Members' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('活动管理');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(16:9)", "entry");
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/Events' });
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(20:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('添加社团');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(21:9)", "entry");
            Button.width('90%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/Clubs' });
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Home.ets(26:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('签到管理');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(27:9)", "entry");
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/CheckIn' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('报名管理');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(31:9)", "entry");
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/EventSignup' });
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(35:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('客服');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(36:9)", "entry");
            Button.width('90%');
            Button.height(50);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/Ai' });
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('注册新管理员账户');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(41:7)", "entry");
            Button.width('90%');
            Button.height(50);
            Button.margin({ top: 10 });
            Button.backgroundColor(Color.Green);
            Button.onClick(() => router.pushUrl({ url: 'pages/Register' }));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('退出登录');
            Button.debugLine("entry/src/main/ets/pages/Home.ets(44:7)", "entry");
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
        return "Home";
    }
}
registerNamedRoute(() => new Home(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/Home", pageFullPath: "entry/src/main/ets/pages/Home", integratedHsp: "false", moduleType: "followWithHap" });
