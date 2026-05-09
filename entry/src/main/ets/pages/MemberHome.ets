import router from '@ohos.router'

// 强类型定义
interface UserInfo {
  id: number
  name: string
  student_id: string
  username?: string
}

@Entry
@Component
struct MemberHome {
  // 从全局取出用户信息
  private userInfo: UserInfo | undefined = AppStorage.Get('user_info')

  build() {
    Column({ space: 20 }) {
      Text('社团管理系统').fontSize(26).fontWeight(FontWeight.Bold)

      // ✅ 显示姓名 + 社团账号
      if (this.userInfo) {
        Text(`社团账号：${this.userInfo.student_id}`)
          .fontSize(16)
          .fontColor('#666')
      }

      Row(){
        Button('加入活动').width('45%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/MemberEventSignup' })
        })

        Button('活动签到').width('45%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/MemberCheckin' })
        })
      }

      Button('AI助手').width('90%').height(50).onClick(() => {
        router.pushUrl({ url: 'pages/Ai' })
      })

      Button('退出登录').width('90%').height(50).backgroundColor('#ff6b6b').margin({ top: 20 })
        .onClick(() => {
          router.replaceUrl({ url: 'pages/Login' })
        })
    }.padding(20).width('100%').height('100%')
  }
}