if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Ai_Params {
    inputText?: string;
    messages?: MessageItem[];
    isLoading?: boolean;
}
import http from "@ohos:net.http";
import util from "@ohos:util";
import { Api } from "@normalized:N&&&entry/src/main/ets/common/Api&";
interface MessageItem {
    type: 'user' | 'ai';
    content: string;
}
interface AiData {
    text: string;
}
interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}
class Ai extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__messages = new ObservedPropertyObjectPU([
            { type: 'ai', content: '你好！我是AI助手，有什么可以帮你的吗？' }
        ], this, "messages");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Ai_Params) {
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
    }
    updateStateVars(params: Ai_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputText.aboutToBeDeleted();
        this.__messages.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
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
    private __messages: ObservedPropertyObjectPU<MessageItem[]>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: MessageItem[]) {
        this.__messages.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    // ✅ 随机延迟打字机效果（3~10毫秒随机）
    async typeWriter(fullText: string): Promise<void> {
        const msgIndex = this.messages.length - 1;
        let currentText = '';
        for (let i = 0; i < fullText.length; i++) {
            if (!this.isLoading)
                break;
            currentText += fullText[i];
            this.messages[msgIndex].content = currentText;
            this.messages = [...this.messages]; // 强制刷新
            const delay = Math.floor(Math.random() * 10) + 18;
            await new Promise<void>((resolve: () => void) => {
                setTimeout(resolve, delay);
            });
        }
        this.isLoading = false;
    }
    async sendMessage(): Promise<void> {
        const contentTrim = this.inputText.trim();
        if (contentTrim === '' || this.isLoading)
            return;
        this.messages.push({ type: 'user', content: contentTrim });
        this.messages.push({ type: 'ai', content: '正在思考...' });
        this.isLoading = true;
        this.inputText = '';
        const req = http.createHttp();
        try {
            const res = await new Promise<http.HttpResponse>((resolve, reject) => {
                req.request(Api.CHAT, {
                    method: http.RequestMethod.POST,
                    header: { 'Content-Type': 'application/json' },
                    extraData: JSON.stringify({ content: contentTrim })
                }, (err, data) => err ? reject(err) : resolve(data));
            });
            // 解析返回
            let rawString = '';
            if (typeof res.result === 'string') {
                rawString = res.result;
            }
            else {
                const ab = res.result as ArrayBuffer;
                rawString = util.TextDecoder.create('utf-8').decode(new Uint8Array(ab));
            }
            const result = JSON.parse(rawString) as ApiResponse<AiData>;
            let rawText = result.data.text;
            const tag = "</think>";
            const idx = rawText.indexOf(tag);
            if (idx !== -1) {
                rawText = rawText.slice(idx + tag.length).trim();
            }
            const finalText = rawText.trim();
            this.typeWriter(finalText);
        }
        catch (err) {
            this.messages[this.messages.length - 1].content = "请求失败";
            this.isLoading = false;
        }
        finally {
            req.destroy();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Ai.ets(104:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 客服');
            Text.debugLine("entry/src/main/ets/pages/Ai.ets(105:7)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 10, bottom: 15 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Ai.ets(110:7)", "entry");
            Scroll.height('80%');
            Scroll.backgroundColor('#FAFAFA');
            Scroll.borderRadius(8);
            Scroll.padding(15);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/pages/Ai.ets(111:9)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const msg = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Ai.ets(113:13)", "entry");
                    Row.width('100%');
                    Row.margin({ bottom: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (msg.type === 'user') {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/Ai.ets(115:17)", "entry");
                                Row.width('100%');
                                Row.justifyContent(FlexAlign.End);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(msg.content);
                                Text.debugLine("entry/src/main/ets/pages/Ai.ets(116:19)", "entry");
                                Text.backgroundColor('#0066CC');
                                Text.fontColor('#FFFFFF');
                                Text.padding(10);
                                Text.borderRadius(12);
                                Text.width('75%');
                            }, Text);
                            Text.pop();
                            Row.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/Ai.ets(126:17)", "entry");
                                Row.width('100%');
                                Row.justifyContent(FlexAlign.Start);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(msg.content);
                                Text.debugLine("entry/src/main/ets/pages/Ai.ets(127:19)", "entry");
                                Text.backgroundColor('#F5F5F5');
                                Text.padding(10);
                                Text.borderRadius(12);
                                Text.width('75%');
                            }, Text);
                            Text.pop();
                            Row.pop();
                        });
                    }
                }, If);
                If.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Ai.ets(149:7)", "entry");
            Row.padding(10);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入问题...', text: this.inputText });
            TextInput.debugLine("entry/src/main/ets/pages/Ai.ets(150:9)", "entry");
            TextInput.onChange((value) => this.inputText = value);
            TextInput.flexGrow(1);
            TextInput.width(100);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.borderRadius(20);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isLoading ? '思考中...' : '发送');
            Button.debugLine("entry/src/main/ets/pages/Ai.ets(157:9)", "entry");
            Button.onClick(() => this.sendMessage());
            Button.enabled(!this.isLoading);
            Button.backgroundColor(this.isLoading ? '#CCCCCC' : '#0066CC');
            Button.borderRadius(20);
            Button.padding({ left: 15, right: 15 });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Ai";
    }
}
registerNamedRoute(() => new Ai(undefined, {}), "", { bundleName: "com.xxy.clubplatformharmony", moduleName: "entry", pagePath: "pages/Ai", pageFullPath: "entry/src/main/ets/pages/Ai", integratedHsp: "false", moduleType: "followWithHap" });
