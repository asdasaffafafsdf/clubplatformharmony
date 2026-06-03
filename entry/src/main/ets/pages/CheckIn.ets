import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { EventSignup, CheckInReq, ApiResponse, Event, Member } from '../common/types'

@Entry
@Component
struct CheckIn {
  @State signups: EventSignup[] = []
  @State loading: boolean = false
  @State message: string = ''
  @State showMessage: boolean = false
  @State selectedSignup: EventSignup | null = null
  @State showCheckInDialog: boolean = false

  // 只有这里新增 3 个状态

  @State totalCount: number = 0
  @State checkedInCount: number = 0
  @State notCheckedInCount: number = 0

  aboutToAppear() {
    this.loadAllSignups()
  }

  // ##############################
  // 只有这里新增一个计算方法（只算checkin_status）
  // ##############################
  updateStats() {
    let total = this.signups.length;
    let checked = 0;
    let unchecked = 0;

    for (let s of this.signups) {
      if (s.checkin_status === 1) {
        checked++;
      } else {
        unchecked++;
      }
    }

    this.totalCount = total;
    this.checkedInCount = checked;
    this.notCheckedInCount = unchecked;
  }

  async loadAllSignups(): Promise<void> {
    this.loading = true
    const req = http.createHttp()

    try {
      const res = await req.request(`${Api.BASE_URL}/event_signups_all`, {
        method: http.RequestMethod.GET,
        header: { 'Content-Type': 'application/json' }
      })

      let result: ApiResponse<EventSignup[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<EventSignup[]>
      } else {
        result = res.result as ApiResponse<EventSignup[]>
      }

      if (result.code === 0) {
        this.signups = result.data || []
        // 加载完成 → 计算
        this.updateStats();
      } else {
        this.showMessage = true
        this.message = result.msg || '加载报名信息失败'
      }
    } catch (error) {
      console.error('加载报名信息失败:', error)
      this.showMessage = true
      this.message = '网络错误，请重试'
    } finally {
      this.loading = false
      req.destroy()
    }
  }

  async performCheckIn(eventId: number, memberId: number): Promise<void> {
    const reqData: CheckInReq = {
      event_id: eventId,
      member_id: memberId
    }

    const req = http.createHttp()

    try {
      const res = await req.request(Api.CHECKIN, {
        method: http.RequestMethod.POST,
        header: { 'Content-Type': 'application/json' },
        extraData: JSON.stringify(reqData)
      })

      let result: ApiResponse<void>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<void>
      } else {
        result = res.result as ApiResponse<void>
      }

      if (result.code === 0) {
        this.showMessage = true
        this.message = result.msg || '签到成功'
        this.signups = this.signups.map(signup => {
          if (signup.event_id === eventId && signup.member_id === memberId) {
            return {
              event_id: signup.event_id,
              member_id: signup.member_id,
              name: signup.name,
              student_id: signup.student_id,
              title: signup.title,
              sign_up_time: signup.sign_up_time,
              checkin_status: 1,
              checkin_time: new Date().toISOString().substring(0, 19).replace('T', ' ')
            }
          }
          return signup
        })
        // 签到完成 → 重新计算
        this.updateStats();
        this.showCheckInDialog = false
      } else {
        this.showMessage = true
        this.message = result.msg || '签到失败'
      }
    } catch (error) {
      console.error('签到失败:', error)
      this.showMessage = true
      this.message = '网络错误，请重试'
    } finally {
      req.destroy()
    }
  }

  build() {
    Stack() {
      Column({ space: 15 }) {
        Text('现场签到').fontSize(24).fontWeight(FontWeight.Bold).alignSelf(ItemAlign.Center)

        // UI 直接读取 3 个数字

        Row({ space: 10 }) {
          Column({ space: 4 }) {
            Text('总共').fontSize(12)
            Text(this.totalCount.toString()).fontSize(20).fontWeight(FontWeight.Bold)
          }
          .flexGrow(1)
          .padding(10)
          .backgroundColor('#f5f7fa')
          .borderRadius(10)

          Column({ space: 4 }) {
            Text('已签到').fontSize(12).fontColor('#fff')
            Text(this.checkedInCount.toString()).fontSize(20).fontWeight(FontWeight.Bold)
          }
          .flexGrow(1)
          .padding(10)
          .backgroundColor('#4caf50')
          .borderRadius(10)

          Column({ space: 4 }) {
            Text('未签到').fontSize(12).fontColor('#fff')
            Text(this.notCheckedInCount.toString()).fontSize(20).fontWeight(FontWeight.Bold)
          }
          .flexGrow(1)
          .padding(10)
          .backgroundColor('#ff9800')
          .borderRadius(10)
        }
        .width('100%')
        .margin({ top: 10 })

        Text('签到列表详情').fontSize(18).alignSelf(ItemAlign.Start).margin({ top: 10 })

        if (this.loading) {
          LoadingProgress().width(50).height(50).margin({ top: 20 })
        } else if (this.signups.length > 0) {
          List({ space: 5 }) {
            ForEach(this.signups, (item: EventSignup) => {
              ListItem() {
                Column({ space: 8 }) {
                  Row({ space: 10 }) {
                    Text("姓名:"+item.name).fontSize(16).fontWeight(FontWeight.Medium)
                    if (item.checkin_status === 1) {
                      Text('已签到').fontSize(12).padding({ left: 8, right: 8, top: 4, bottom: 4 })
                        .backgroundColor('#4caf50').fontColor('#fff').borderRadius(6)
                    } else {
                      Text('未签到').fontSize(12).padding({ left: 8, right: 8, top: 4, bottom: 4 })
                        .backgroundColor('#ff9800').fontColor('#fff').borderRadius(6)
                    }
                  }.width('100%').justifyContent(FlexAlign.SpaceBetween)

                  Text(`${item.title} - 社团账号: ${item.student_id}`).fontSize(14).fontColor('#666')

                  Row({ space: 10 }) {
                    Text(`报名时间: ${item.sign_up_time.substring(0, 16)}`).fontSize(12).fontColor('#999')
                    if (item.checkin_time) {
                      Text(`签到: ${item.checkin_time.substring(0, 16)}`).fontSize(12).fontColor('#999')
                    }
                  }.width('100%').justifyContent(FlexAlign.SpaceBetween)

                  if (item.checkin_status !== 1) {
                    Button('执行签到')
                      .width('100%')
                      .onClick(() => {
                        this.selectedSignup = item
                        this.showCheckInDialog = true
                      })
                  } else {
                    Text('已完成签到').fontSize(12).fontColor('#4caf50').alignSelf(ItemAlign.End)
                  }
                }.padding(10).width('100%').height(120)
                .borderRadius(8).backgroundColor('#ffffff').shadow({ radius:4, color:'#e0e0e0', offsetX:0, offsetY:2 })
              }
            })
            ListItem().height(100)
          }.padding({ top:10 }).cachedCount(20)
        } else {
          Text('暂无报名信息').fontSize(16).fontColor('#999').margin({ top:20 })
        }
      }.padding(20).width('100%').height('100%')

      if (this.showCheckInDialog && this.selectedSignup) {
        Column() {
          Column({ space:15 }) {
            Row() {
              Text('确认签到').fontSize(18).fontWeight(FontWeight.Bold)
              Text('×').fontSize(20).width(30).height(30).borderRadius(15)
                .backgroundColor('#f0f0f0').textAlign(TextAlign.Center)
                .onClick(() => this.showCheckInDialog = false)
            }.width('100%').justifyContent(FlexAlign.SpaceBetween)

            Column({ space:10 }) {
              Text(`成员: ${this.selectedSignup.name}`)
              Text(`活动: ${this.selectedSignup.title}`)
              Text(`社团账号: ${this.selectedSignup.student_id}`).fontColor('#666')
            }

            Row({ space:10 }) {
              Button('取消').width('45%').backgroundColor('#e0e0e0')
                .onClick(() => this.showCheckInDialog = false)
              Button('确认签到').width('45%').backgroundColor('#2196f3').fontColor('#fff')
                .onClick(() => {
                  if (this.selectedSignup) {
                    this.performCheckIn(this.selectedSignup.event_id, this.selectedSignup.member_id)
                  }
                })
            }
          }.padding(20).width('80%').borderRadius(12).backgroundColor('#fff')
        }.position({ x:'10%', y:'30%' })
      }

      if (this.showMessage) {
        Text(this.message)
          .position({ x:'20%', y:'10%' })
          .width('60%').height(50)
          .backgroundColor('#333').fontColor('#fff').borderRadius(8)
          .textAlign(TextAlign.Center)
          .onAppear(() => setTimeout(() => this.showMessage = false, 2000))
      }
    }
  }
}