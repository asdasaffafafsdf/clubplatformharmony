// pages/Register.ets
import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { RegisterReq, ApiResponse, HttpRequestOptions } from '../common/types'

@Entry
@Component
struct Register {
  @State username: string = ''
  @State password: string = ''
  @State confirmPassword: string = ''
  @State errorMsg: string = ''
  @State successMsg: string = ''

  async register(): Promise<void> {
    if (!this.username || !this.password) {
      this.errorMsg = '请输入用户名和密码'
      return
    }

    if (this.password !== this.confirmPassword) {
      this.errorMsg = '两次输入的密码不一致'
      return
    }

    const reqData: RegisterReq = {
      username: this.username,
      password: this.password
    }

    const req = http.createHttp()

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
            reject(err)
          } else {
            resolve(data)
          }
        })
      }) as http.HttpResponse

      console.info('Register response:', JSON.stringify(res))

      let result: ApiResponse<void>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string) as ApiResponse<void>
      } else {
        result = res.result as ApiResponse<void>
      }

      if (result.code === 0) {
        this.successMsg = result.msg || '注册成功'
        this.errorMsg = ''
        setTimeout(() => {
          router.back()
        }, 1500)
      } else {
        this.errorMsg = result.msg || '注册失败'
        this.successMsg = ''
      }
    } catch (error) {
      this.errorMsg = '网络错误，请重试'
      console.error('Register error:', JSON.stringify(error))
    } finally {
      req.destroy()
    }
  }

  build() {
    Column({ space: 20 }) {
      Text('注册').fontSize(26).fontWeight(FontWeight.Bold)

      if (this.errorMsg) {
        Text(this.errorMsg).fontSize(14).fontColor('#f44336').width('100%')
      }

      if (this.successMsg) {
        Text(this.successMsg).fontSize(14).fontColor('#4caf50').width('100%')
      }

      TextInput({ placeholder: '用户名', text: this.username })
        .onChange(v => this.username = v)
        .borderRadius(8)
        .backgroundColor('#f5f5f5')
        .padding({ left: 10, right: 10 })
        .margin({ top: 10 })

      TextInput({ placeholder: '密码', text: this.password })
        .type(InputType.Password)
        .onChange(v => this.password = v)
        .borderRadius(8)
        .backgroundColor('#f5f5f5')
        .padding({ left: 10, right: 10 })
        .margin({ top: 10 })

      TextInput({ placeholder: '确认密码', text: this.confirmPassword })
        .type(InputType.Password)
        .onChange(v => this.confirmPassword = v)
        .borderRadius(8)
        .backgroundColor('#f5f5f5')
        .padding({ left: 10, right: 10 })
        .margin({ top: 10 })

      Button('注册').width('100%').height(50).margin({ top: 20 })
        .onClick(() => this.register())
    }.padding(20).width('100%').height('100%')
  }
}