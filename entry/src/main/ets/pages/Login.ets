import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { LoginReq, ApiResponse, UserType, User, MemberLoginReq } from '../types'
import { SegmentButton, SegmentButtonOptions, AppStorageV2 } from '@kit.ArkUI'

@Entry
@Component
struct Login {
  @State username: string = ''
  @State password: string = ''
  @State errorMsg: string = ''
  @State userType: UserType = UserType.ADMIN
  @State selectedIndex: number[] = [0]

  @State tabOptions: SegmentButtonOptions = SegmentButtonOptions.tab({
    buttons: [
      { text: '管理员登录' },
      { text: '成员登录' }
    ]
  })

  async login(): Promise<void> {
    if (!this.username || !this.password) {
      // this.errorMsg = '请输入完整信息'+this.selectedIndex
      if (this.selectedIndex[0]==0) {
        this.errorMsg = '请输入完整信息'
      }else if (this.selectedIndex[0]==1) {
        this.errorMsg = '请联系管理员为你添加账户'
      }
      return
    }

    if (this.userType === UserType.ADMIN) {
      await this.adminLogin()
    } else {
      await this.memberLogin()
    }
  }

  async adminLogin(): Promise<void> {
    const reqData: LoginReq = {
      username: this.username,
      password: this.password
    }

    const req = http.createHttp()

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
            reject(err)
          } else {
            resolve(data)
          }
        })
      }) as http.HttpResponse

      let result: ApiResponse<User>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string) as ApiResponse<User>
      } else {
        result = res.result as ApiResponse<User>
      }

      if (result.code === 0 && result.data) {
        AppStorage.SetOrCreate('user_info', result.data)
        AppStorage.SetOrCreate('user_type', UserType.ADMIN)
        router.replaceUrl({ url: 'pages/Home' })
        this.errorMsg = ''
      } else {
        this.errorMsg = result.msg || '登录失败'
      }
    } catch (error) {
      this.errorMsg = '网络错误，请重试'
    } finally {
      req.destroy()
    }
  }

  async memberLogin(): Promise<void> {
    const reqData: MemberLoginReq = {
      username: this.username,
      studentId: this.password
    }

    const req = http.createHttp()

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
            reject(err)
          } else {
            resolve(data)
          }
        })
      }) as http.HttpResponse

      let result: ApiResponse<User>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string) as ApiResponse<User>
      } else {
        result = res.result as ApiResponse<User>
      }

      if (result.code === 0 && result.data) {
        // ✅ 这里会把【姓名、社团账号、ID】全部存到全局
        AppStorage.SetOrCreate('user_info', result.data)
        AppStorage.SetOrCreate('user_type', UserType.MEMBER)
        router.replaceUrl({ url: 'pages/MemberHome' })
        this.errorMsg = ''
      } else {
        this.errorMsg = result.msg || '登录失败'
      }
    } catch (error) {
      this.errorMsg = '网络错误，请重试'
    } finally {
      req.destroy()
    }
  }

  build() {
    Column({ space: 20 }) {
      Text('登录').fontSize(26).fontWeight(FontWeight.Bold)

      SegmentButton({
        options: this.tabOptions,
        selectedIndexes: this.selectedIndex,
        onItemClicked: (index: number) => {
          this.selectedIndex = [index]
          this.userType = index === 0 ? UserType.ADMIN : UserType.MEMBER
          this.username = ''
          this.password = ''
          this.errorMsg = ''
        }
      })
        .width('100%')
        .margin({ top: 20 })

      if (this.errorMsg) {
        Text(this.errorMsg).fontSize(14).fontColor('#f44336').width('100%')
      }

      TextInput({ placeholder: this.userType === UserType.ADMIN ? '用户名' : '姓名', text: this.username })
        .borderRadius(8)
        .backgroundColor('#f5f5f5')
        .padding({ left: 10, right: 10 })
        .margin({ top: 10 })
        .onChange((val) => {
          this.username = val
        })

      TextInput({
        placeholder: this.userType === UserType.ADMIN ? '密码' : '社团账号',
        text: this.password
      })
        .borderRadius(8)
        .backgroundColor('#f5f5f5')
        .padding({ left: 10, right: 10 })
        .margin({ top: 10 })
        .type(this.userType === UserType.ADMIN ? InputType.Password : InputType.Normal)
        .onChange((val) => {
          this.password = val
        })

      Button('登录').width('100%').height(50).margin({ top: 20 })
        .onClick(() => this.login())

    }.padding(20).width('100%').height('100%')
  }
}