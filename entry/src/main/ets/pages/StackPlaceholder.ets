@Entry
@Component
struct StackPlaceholder {
  @State inputText: string = '';

  build() {
    Column({ space: 20 }) {
      Stack({ alignContent: Alignment.Start }) {
        // 底层：透明占位的TextInput
        TextInput({ text: this.inputText })
          .width('100%')
          .height(48)
          .border({ width: 1, color: '#E5E5E5', radius: 8 })
          .padding({ left: 12 })
          .placeholderColor(Color.Transparent) // 隐藏原生placeholder
          .onChange((value) => {
            this.inputText = value;
          });

        // 上层：多色Text，输入为空时显示
        if (this.inputText === '') {
          Text() {
            Span('活动标题').fontColor(Color.Grey).fontSize(16);
            Span('*').fontColor(Color.Red).fontSize(16).fontWeight(FontWeight.Bold);
          }
          .padding({ left: 12 })
        }
      }
    }.padding(20).width('100%')
  }
}