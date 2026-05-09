import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { AppStorageV2 } from '@kit.ArkUI'

interface UserInfo {
  id: number
  name: string
  student_id: string
  club_id: number      // 必须加这个
}

interface Event {
  id: number
  club_id: number
  title: string
  content: string
  location: string
  start_time: string
  end_time: string
  status: string
}

interface SignupRecord {
  event_id: number
  member_id: number
  student_id: string
}

interface SignupReq {
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
struct MemberEventSignup {
  @State events: Event[] = []
  @State mySignupEventIds: Set<number> = new Set()
  @State loading: boolean = false
  @State message: string = ''
  @State showMessage: boolean = false

  private userInfo: UserInfo | undefined = AppStorage.get('user_info')
  private memberId: number = 0
  private myStudentId: string = ''
  private myClubId: number = 0  // 自己社团ID

  aboutToAppear() {
    if (this.userInfo) {
      this.memberId = this.userInfo.id
      this.myStudentId = this.userInfo.student_id
      this.myClubId = this.userInfo.club_id // 取出自己社团
    }
    this.loadEvents()
    this.loadMySignups()
  }

  async loadEvents(): Promise<void> {
    this.loading = true
    const req = http.createHttp()

    try {
      const res = await req.request(Api.EVENTS, {
        method: http.RequestMethod.GET,
        header: { 'Content-Type': 'application/json' }
      })

      let result: ApiResponse<Event[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<Event[]>
      } else {
        result = { code: -1 }
      }

      if (result.code === 0 && result.data) {
        // ==========================
        // 【核心修复】只保留自己社团的活动
        // ==========================
        this.events = result.data.filter(e => e.club_id === this.myClubId)
      }
    } catch (err) {
      this.showMsg('网络错误')
    } finally {
      this.loading = false
      req.destroy()
    }
  }

  async loadMySignups(): Promise<void> {
    if (this.memberId <= 0) return

    const req = http.createHttp()
    try {
      const res = await req.request(Api.EVENT_SIGNUPS, {
        method: http.RequestMethod.GET,
        header: { 'Content-Type': 'application/json' }
      })

      let result: ApiResponse<SignupRecord[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<SignupRecord[]>
      } else {
        result = { code: -1 }
      }

      if (result.code === 0 && result.data) {
        const ids = new Set<number>()
        result.data.forEach(item => {
          if (item.member_id === this.memberId) {
            ids.add(item.event_id)
          }
        })
        this.mySignupEventIds = ids
      }
    } finally {
      req.destroy()
    }
  }

  async signupEvent(event: Event): Promise<void> {
    if (this.memberId <= 0) return

    const reqData: SignupReq = {
      event_id: event.id,
      member_id: this.memberId
    }

    const req = http.createHttp()
    try {
      const res = await req.request(Api.SIGNUP, {
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
        this.showMsg('报名成功')
        this.mySignupEventIds.add(event.id)
      } else {
        this.showMsg(result.msg ?? '报名失败')
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
        Text('活动报名').fontSize(24).fontWeight(FontWeight.Bold).alignSelf(ItemAlign.Center)

        if (this.loading) {
          LoadingProgress().width(50).height(50)
        } else if (this.events.length > 0) {
          List({ space: 8 }) {
            ForEach(this.events, (item: Event) => {
              ListItem() {
                Column({ space: 6 }) {
                  Row() {
                    Text(item.title).fontSize(16).fontWeight(FontWeight.Medium)
                    Text(item.status === 'published' ? '已发布' : '未发布')
                      .fontSize(12)
                      .backgroundColor('#4CAF50')
                      .fontColor('#fff')
                      .padding(4)
                      .borderRadius(4)
                  }.width('100%').justifyContent(FlexAlign.SpaceBetween)

                  Text(item.content || '无描述').fontSize(14).maxLines(2)
                  Text(`地点：${item.location}`).fontSize(12).fontColor('#666')
                  Text(`时间：${item.start_time.substring(0,16)} - ${item.end_time.substring(0,16)}`).fontSize(12).fontColor('#666')

                  Button(this.mySignupEventIds.has(item.id) ? '已报名' : '立即报名')
                    .width('100%')
                    .enabled(!this.mySignupEventIds.has(item.id))
                    .backgroundColor(this.mySignupEventIds.has(item.id) ? '#ccc' : '#2196F3')
                    .onClick(() => this.signupEvent(item))
                }
                .padding(12)
                .backgroundColor('#fff')
                .borderRadius(10)
              }
            })
          }
        } else {
          Text('暂无活动').fontSize(16).fontColor('#999')
        }
      }.padding(20).width('100%').height('100%')

      if (this.showMessage) {
        Text(this.message).width('70%').height(44).backgroundColor('#333').fontColor('#fff')
          .textAlign(TextAlign.Center).position({ left: '15%', top: '10%' })
      }
    }
  }
}