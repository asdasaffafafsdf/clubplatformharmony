if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface StackPlaceholder_Params {
    inputText?: string;
}
class StackPlaceholder extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: StackPlaceholder_Params) {
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
    }
    updateStateVars(params: StackPlaceholder_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/pages/StackPlaceholder.ets(7:5)", "entry");
            Column.padding(20);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Start });
            Stack.debugLine("entry/src/main/ets/pages/StackPlaceholder.ets(8:7)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底层：透明占位的TextInput
            TextInput.create({ text: this.inputText });
            TextInput.debugLine("entry/src/main/ets/pages/StackPlaceholder.ets(10:9)", "entry");
            // 底层：透明占位的TextInput
            TextInput.width('100%');
            // 底层：透明占位的TextInput
            TextInput.height(48);
            // 底层：透明占位的TextInput
            TextInput.border({ width: 1, color: '#E5E5E5', radius: 8 });
            // 底层：透明占位的TextInput
            TextInput.padding({ left: 12 });
            // 底层：透明占位的TextInput
            TextInput.placeholderColor(Color.Transparent);
            // 底层：透明占位的TextInput
            TextInput.onChange((value) => {
                this.inputText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 上层：多色Text，输入为空时显示
            if (this.inputText === '') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create();
                        Text.debugLine("entry/src/main/ets/pages/StackPlaceholder.ets(22:11)", "entry");
                        Text.padding({ left: 12 });
                    }, Text);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Span.create('活动标题');
                        Span.debugLine("entry/src/main/ets/pages/StackPlaceholder.ets(23:13)", "entry");
                        Span.fontColor(Color.Grey);
                        Span.fontSize(16);
                    }, Span);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Span.create('*');
                        Span.debugLine("entry/src/main/ets/pages/StackPlaceholder.ets(24:13)", "entry");
                        Span.fontColor(Color.Red);
                        Span.fontSize(16);
                        Span.fontWeight(FontWeight.Bold);
                    }, Span);
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
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "StackPlaceholder";
    }
}
registerNamedRoute(() => new StackPlaceholder(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/StackPlaceholder", pageFullPath: "entry/src/main/ets/pages/StackPlaceholder", integratedHsp: "false", moduleType: "followWithHap" });
