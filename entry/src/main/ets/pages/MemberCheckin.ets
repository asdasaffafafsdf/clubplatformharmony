import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { AppStorageV2 } from '@kit.ArkUI'

interface UserInfo {
  id: number
  name: string
  student_id: string
}

interface EventSignup {
  event_id: number
  member_id: number
  student_id: string
  name: string
  title: string
  sign_up_time: string
  checkin_status: number
  checkin_time: string | null
}

interface CheckInReq {
  event_id: number
  member_id: number
}

interface ApiResponse<T = undefined> {
  code: number
  data?: T
  msg?: string
}

@Entry
@Component
struct MemberCheckin {
  @State signups: EventSignup[] = []
  @State loading: boolean = false
  @State message: string = ''
  @State showMessage: boolean = false

  private userInfo: UserInfo | undefined = AppStorage.get('user_info')
  private memberId: number = 0

  aboutToAppear() {
    if (this.userInfo) {
      this.memberId = this.userInfo.id
    }
    this.loadMySignups()
  }

  async loadMySignups(): Promise<void> {
    if (this.memberId <= 0) return

    this.loading = true
    const req = http.createHttp()

    try {
      // ======================
      // 【唯一修复】换成带签到状态的接口！
      // ======================
      const res = await req.request(Api.EVENT_SIGNUPS_ALL, {
        method: http.RequestMethod.GET,
        header: { 'Content-Type': 'application/json' }
      })

      let result: ApiResponse<EventSignup[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<EventSignup[]>
      } else {
        result = { code: -1 }
      }

      if (result.code === 0 && result.data) {
        this.signups = result.data.filter(item => item.member_id === this.memberId)
      }
    } finally {
      this.loading = false
      req.destroy()
    }
  }

  async performCheckIn(eventId: number): Promise<void> {
    if (this.memberId <= 0) return

    const reqData: CheckInReq = {
      event_id: eventId,
      member_id: this.memberId
    }

    const req = http.createHttp()
    try {
      const res = await req.request(Api.MEMBER_CHECKIN, {
        method: http.RequestMethod.POST,
        header: { 'Content-Type': 'application/json' },
        extraData: JSON.stringify(reqData)
      })

      let result: ApiResponse
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse
      } else {
        result = { code: -1 }
      }

      if (result.code === 0) {
        this.showMsg('签到成功')
        this.loadMySignups() // 签到后重新拉取最新状态
      } else {
        this.showMsg(result.msg ?? '签到失败')
      }
    } finally {
      req.destroy()
    }
  }

  showMsg(msg: string) {
    this.message = msg
    this.showMessage = true
    setTimeout(() => this.showMessage = false, 2000)
  }

  build() {
    Stack() {
      Column({ space: 15 }) {
        Text('我的签到').fontSize(24).fontWeight(FontWeight.Bold)
        Text('我的报名记录').fontSize(18)

        if (this.loading) {
          LoadingProgress().width(50).height(50)
        } else if (this.signups.length > 0) {
          List({ space: 8 }) {
            ForEach(this.signups, (item: EventSignup) => {
              ListItem() {
                Column({ space: 6 }) {
                  Row() {
                    Text(item.name).fontSize(16)
                    if (item.checkin_status === 1) {
                      Text('已签到').backgroundColor('#4CAF50').fontColor('#fff').padding(4).borderRadius(4)
                    } else {
                      Text('未签到').backgroundColor('#FF9800').fontColor('#fff').padding(4).borderRadius(4)
                    }
                  }.width('100%').justifyContent(FlexAlign.SpaceBetween)

                  Text(`活动：${item.title}`).fontSize(14)
                  Text(`报名：${item.sign_up_time.slice(0, 16)}`).fontSize(12).fontColor('#666')

                  if (item.checkin_status !== 1) {
                    Button('立即签到').width('100%').onClick(() => this.performCheckIn(item.event_id))
                  } else {
                    Text('已完成签到').fontColor('#4CAF50').alignSelf(ItemAlign.End)
                  }
                }
                .padding(12)
                .backgroundColor('#fff')
                .borderRadius(10)
              }
            })
          }
        } else {
          Text('暂无报名信息').fontSize(16).fontColor('#999')
        }
      }.padding(20).width('100%').height('100%')

      if (this.showMessage) {
        Text(this.message).width('70%').height(44).backgroundColor('#333').fontColor('#fff')
          .textAlign(TextAlign.Center).position({ left: '15%', top: '10%' })
      }
    }
  }
}