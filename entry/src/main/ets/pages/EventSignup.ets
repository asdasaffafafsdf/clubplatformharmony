// pages/EventSignup.ets
import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { SignupReq, ApiResponse, Event, Member } from '../common/types'

@Entry
@Component
struct EventSignupPage {
  @State events: Event[] = []
  @State loading: boolean = false
  @State message: string = ''
  @State showMessage: boolean = false
  @State showSignupDialog: boolean = false
  @State selectedEvent: Event | null = null
  @State selectedMemberId: string = ''
  @State allMembers: Member[] = []
  @State signupCount: Record<number, number> = {}

  aboutToAppear() {
    this.loadEvents()
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
        result = res.result as ApiResponse<Event[]>
      }

      if (result.code === 0) {
        this.events = result.data || []
        await this.updateSignupCounts()
      } else {
        this.showMessage = true
        this.message = result.msg || '加载活动失败'
      }
    } catch (error) {
      console.error('加载活动失败:', error)
      this.showMessage = true
      this.message = '网络错误，请重试'
    } finally {
      this.loading = false
      req.destroy()
    }
  }

  // ======================
  // 【关键修复】只加载当前活动所在社团的成员
  // ======================
  async loadMembersByClubId(clubId: number): Promise<void> {
    const req = http.createHttp()

    try {
      const res = await req.request(`${Api.MEMBERS}?club_id=${clubId}`, {
        method: http.RequestMethod.GET,
        header: { 'Content-Type': 'application/json' }
      })

      let result: ApiResponse<Member[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<Member[]>
      } else {
        result = res.result as ApiResponse<Member[]>
      }

      if (result.code === 0) {
        this.allMembers = result.data || []
      }
    } catch (error) {
      console.error('加载成员失败:', error)
    } finally {
      req.destroy()
    }
  }

  async updateSignupCounts(): Promise<void> {
    const counts: Record<number, number> = {}

    for (const event of this.events) {
      const req = http.createHttp()
      try {
        const res = await req.request(`${Api.EVENT_SIGNUPS}?event_id=${event.id}`, {
          method: http.RequestMethod.GET,
          header: { 'Content-Type': 'application/json' }
        })

        let result: ApiResponse
        if (typeof res.result === 'string') {
          result = JSON.parse(res.result) as ApiResponse
        } else {
          result = res.result as ApiResponse
        }

        if (result.code === 0 && Array.isArray(result.data)) {
          counts[event.id] = result.data.length
        } else {
          counts[event.id] = 0
        }
      } catch (error) {
        console.error(`获取活动 ${event.id} 报名数失败:`, error)
        counts[event.id] = 0
      } finally {
        req.destroy()
      }
    }
    this.signupCount = counts
  }

  async signupForEvent(): Promise<void> {
    if (!this.selectedEvent || !this.selectedMemberId) {
      this.showMessage = true
      this.message = '请选择活动和成员'
      return
    }

    const reqData: SignupReq = {
      event_id: this.selectedEvent.id,
      member_id: parseInt(this.selectedMemberId)
    }

    const req = http.createHttp()

    try {
      const res = await req.request(Api.SIGNUP, {
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
        this.message = result.msg || '报名成功'
        this.showSignupDialog = false
        this.selectedMemberId = ''
        this.signupCount[this.selectedEvent.id] = (this.signupCount[this.selectedEvent.id] || 0) + 1
        this.loadEvents()
      } else {
        this.showMessage = true
        this.message = result.msg || '报名失败'
      }
    } catch (error) {
      console.error('报名失败:', error)
      this.showMessage = true
      this.message = '网络错误，请重试'
    } finally {
      req.destroy()
    }
  }

  build() {
    Stack() {
      Column({ space: 15 }) {
        Text('活动报名管理').fontSize(24).fontWeight(FontWeight.Bold).alignSelf(ItemAlign.Center)

        Text('活动列表').fontSize(18).alignSelf(ItemAlign.Start).margin({ top: 10 })

        if (this.loading) {
          LoadingProgress().width(50).height(50).margin({ top: 20 })
        } else if (this.events.length > 0) {
          List({ space: 5 }) {
            ForEach(this.events, (item: Event) => {
              ListItem() {
                Column({ space: 8 }) {
                  Row({ space: 10 }) {
                    Text(item.title).fontSize(16).fontWeight(FontWeight.Medium)

                    Text(item.status== 'draft' ? '校外活动' : '校内活动').fontSize(12).padding({ left: 8, right: 8, top: 4, bottom: 4 })
                      .backgroundColor(item.status === 'published' ? '#4caf50' : '#ff9800')
                      .fontColor('#fff').borderRadius(6)
                  }.width('100%').justifyContent(FlexAlign.SpaceBetween)

                  Text(item.content || '无描述').fontSize(14).maxLines(2).textOverflow({ overflow: TextOverflow.Ellipsis })

                  Row({ space: 10 }) {
                    Text(`地点: ${item.location || '未指定'}`).fontSize(12).fontColor('#666')
                    Text(`${item.start_time.substring(0, 16)} - ${item.end_time.substring(0, 16)}`).fontSize(12).fontColor('#666')
                  }.width('100%').justifyContent(FlexAlign.SpaceBetween)

                  Row({ space: 10 }){
                    Text(`报名人数: ${this.signupCount[item.id] || 0}`).fontSize(12).fontColor('#666')
                    Button('报名').width(80).height(35)
                      .onClick(() => {
                        this.selectedEvent = item

                        // 打开弹窗时只加载本社团成员

                        this.loadMembersByClubId(item.club_id)
                        this.showSignupDialog = true
                      })
                  }.width('100%').justifyContent(FlexAlign.SpaceBetween)
                }.padding(10).width('100%').height(140)
                .borderRadius(8).backgroundColor('#ffffff').shadow({ radius:4, color:'#e0e0e0', offsetX:0, offsetY:2 })
              }
            })
            ListItem().height(100)
          }.padding({ top:10 }).cachedCount(20)
        } else {
          Text('暂无活动').fontSize(16).fontColor('#999').margin({ top:20 })
        }
      }.padding(20).width('100%').height('100%')

      if (this.showSignupDialog && this.selectedEvent) {
        Column() {
          Column({ space: 15 }) {
            Row() {
              Text('活动报名').fontSize(18).fontWeight(FontWeight.Bold)
              Text('×').fontSize(20).width(30).height(30).borderRadius(15)
                .backgroundColor('#f0f0f0').textAlign(TextAlign.Center)
                .onClick(() => {
                  this.showSignupDialog = false
                  this.selectedMemberId = ''
                })
            }.width('100%').justifyContent(FlexAlign.SpaceBetween)

            Column({ space: 15 }) {
              Text(`活动: ${this.selectedEvent.title}`).fontSize(16)
              Text(`时间: ${this.selectedEvent.start_time.substring(0, 16)} - ${this.selectedEvent.end_time.substring(0, 16)}`).fontSize(14).fontColor('#666')

              Text('选择成员').fontSize(14).alignSelf(ItemAlign.Start)
              List({ space: 5 }) {
                ForEach(this.allMembers, (member: Member) => {
                  ListItem() {
                    Row() {
                      Text(`姓名:${member.name} (社团账号:${member.student_id})`).fontSize(14)
                      if (this.selectedMemberId === member.id.toString()) {
                        Text('✓').fontSize(16).fontColor('#2196f3').margin({ left:10 })
                      }
                    }.padding(10).width('100%').height(50)
                    .borderRadius(6).backgroundColor(this.selectedMemberId === member.id.toString() ? '#e3f2fd' : '#f5f5f5')
                    .onClick(() => {
                      this.selectedMemberId = member.id.toString()
                    })
                  }
                })

              }.border({ width:1, color:'#e0e0e0' }).borderRadius(6).height(150)
            }

            Row({ space:10 }){
              Button('取消').width('45%').backgroundColor('#e0e0e0')
                .onClick(() => {
                  this.showSignupDialog = false
                  this.selectedMemberId = ''
                })

              Button('确认报名').width('45%').backgroundColor('#2196f3').fontColor('#fff')
                .enabled(!!this.selectedMemberId)
                .onClick(() => this.signupForEvent())
            }.width('100%')
          }.padding(20).width('80%').borderRadius(12).backgroundColor('#ffffff')
        }.position({ x:'10%', y:'30%' })
      }

      if (this.showMessage) {
        Text(this.message).position({ x:'20%', y:'10%' }).width('60%').height(50)
          .backgroundColor('#333').fontColor('#fff').borderRadius(8)
          .textAlign(TextAlign.Center).fontSize(14)
          .onAppear(() => setTimeout(() => this.showMessage = false, 2000))
      }
    }
  }
}