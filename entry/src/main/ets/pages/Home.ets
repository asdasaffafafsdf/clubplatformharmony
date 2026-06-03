// pages/Home.ets
import router from '@ohos.router'

@Entry
@Component
struct Home {
  build() {
    Column({ space: 20 }) {
      Text('社团管理系统').fontSize(26).fontWeight(FontWeight.Bold)

      Row({ space: 10 }) {
        Button('成员管理').width('45%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/Members' })
        })

        Button('活动管理').width('45%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/Events' })
        })
      }
      Row(){
        Button('添加社团').width('90%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/Clubs' })
        })
      }

      Row({ space: 10 }) {
        Button('签到管理').width('45%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/CheckIn' })
        })

        Button('报名管理').width('45%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/EventSignup' })
        })
      }
      Row(){
        Button('成员信息更改').width('90%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/MemberCheckPage' })
        })
      }
      Row(){
        Button('客服').width('90%').height(50).onClick(() => {
          router.pushUrl({ url: 'pages/Ai' })
        })
      }

      Button('注册新管理员账户').width('90%').height(50).margin({ top: 10 })
        .backgroundColor(Color.Green)
        .onClick(() => router.pushUrl({ url: 'pages/Register' }))
      Button('退出登录').width('90%').height(50).backgroundColor('#ff6b6b').margin({ top: 20 })
        .onClick(() => {
          router.replaceUrl({ url: 'pages/Login' })
        })
    }.padding(20).width('100%').height('100%')
  }
}