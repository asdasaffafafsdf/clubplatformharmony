import { BusinessError } from '@ohos.base';
import http from '@ohos.net.http';
import { util } from '@kit.ArkTS';
import { Api } from '../common/Api';

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

@Entry
@Component
struct Ai {
  @State inputText: string = '';
  @State messages: MessageItem[] = [
    { type: 'ai', content: '你好！我是AI助手，有什么可以帮你的吗？' }
  ];
  @State isLoading: boolean = false;

  // ✅ 随机延迟打字机效果（3~10毫秒随机）
  async typeWriter(fullText: string): Promise<void> {
    const msgIndex = this.messages.length - 1;
    let currentText = '';

    for (let i = 0; i < fullText.length; i++) {
      if (!this.isLoading) break;

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
    if (contentTrim === '' || this.isLoading) return;

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
      } else {
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

    } catch (err) {
      this.messages[this.messages.length - 1].content = "请求失败";
      this.isLoading = false;
    } finally {
      req.destroy();
    }
  }

  build() {
    Column() {
      Text('AI 客服')
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 10, bottom: 15 });

      Scroll() {
        Column({ space: 12 }) {
          ForEach(this.messages, (msg: MessageItem) => {
            Row() {
              if (msg.type === 'user') {
                Row() {
                  Text(msg.content)
                    .backgroundColor('#0066CC')
                    .fontColor('#FFFFFF')
                    .padding(10)
                    .borderRadius(12)
                    .width('75%');
                }
                .width('100%')
                .justifyContent(FlexAlign.End);
              } else {
                Row() {
                  Text(msg.content)
                    .backgroundColor('#F5F5F5')
                    .padding(10)
                    .borderRadius(12)
                    .width('75%');
                }
                .width('100%')
                .justifyContent(FlexAlign.Start);
              }
            }
            .width('100%')
            .margin({ bottom: 8 });
          });
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start);
      }
      .height('80%')
      .backgroundColor('#FAFAFA')
      .borderRadius(8)
      .padding(15);

      Row({ space: 8 }) {
        TextInput({ placeholder: '请输入问题...', text: this.inputText })
          .onChange((value) => this.inputText = value)
          .flexGrow(1)
          .width(100)
          .backgroundColor('#FFFFFF')
          .borderRadius(20);

        Button(this.isLoading ? '思考中...' : '发送')
          .onClick(() => this.sendMessage())
          .enabled(!this.isLoading)
          .backgroundColor(this.isLoading ? '#CCCCCC' : '#0066CC')
          .borderRadius(20)
          .padding({ left: 15, right: 15 });
      }
      .padding(10)
      .width('100%');
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }
}