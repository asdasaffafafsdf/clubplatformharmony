import { AddEventReq, ApiResponse, Club,Event } from '../common/types'
import { http } from '@kit.NetworkKit'
import { Api } from '../common/Api'

@Entry
@Component
struct Events {
  @State events: Event[] = []
  @State newEventTitle: string = ''
  @State newEventContent: string = ''
  @State newLocation: string = ''
  @State newStartTime: string = ''
  @State newEndTime: string = ''
  @State newStatus: string = 'published'
  @State loading: boolean = false
  @State message: string = ''
  @State selectedClubId: number = 1  // 默认社团ID
  @State clubs: Club[] = []
  @State showStartTimePicker: boolean = false
  @State showEndTimePicker: boolean = false
  @State startTimeDate: Date = new Date()
  @State endTimeDate: Date = new Date()
  @State selectedClubName: string = AppStorage.Get<string>('selectedClubName') ?? ''


  aboutToAppear() {
    this.loadClubs()
    this.loadEvents()
  }

  // 加载社团列表（修复版）
  async loadClubs(): Promise<void> {
    const httpRequest = http.createHttp()

    try {
      // 鸿蒙正确写法：url 单独第一个参数，options 第二个
      const response = await httpRequest.request(Api.CLUBS, {
        method: http.RequestMethod.GET,
        header: {
          'Content-Type': 'application/json'
        }
      })

      // 明确解析类型
      let result: ApiResponse<Club[]>
      if (typeof response.result === 'string') {
        result = JSON.parse(response.result)
      } else {
        result = response.result as ApiResponse<Club[]>
      }

      if (result.code === 0) {
        this.clubs = result.data ?? []
        if (this.clubs.length > 0) {
          this.selectedClubId = this.clubs[0].id
          this.selectedClubName = this.clubs[0].name

        }
      }
    } catch (error) {
      console.error('加载社团异常:', JSON.stringify(error))
    } finally {
      httpRequest.destroy()
    }
  }

  // 加载活动列表（修复版）
  async loadEvents(): Promise<void> {
    this.loading = true
    const httpRequest = http.createHttp()

    try {
      const url = `${Api.EVENTS}?club_id=${this.selectedClubId}`
      const response = await httpRequest.request(url, {
        method: http.RequestMethod.GET,
        header: {
          'Content-Type': 'application/json'
        }
      })

      let result: ApiResponse<Event[]>
      if (typeof response.result === 'string') {
        result = JSON.parse(response.result)
      } else {
        result = response.result as ApiResponse<Event[]>
      }

      if (result.code === 0) {
        this.events = result.data ?? []
      }
    } catch (error) {
      console.error('加载活动异常:', JSON.stringify(error))
    } finally {
      this.loading = false
      httpRequest.destroy()
    }
  }

  async addEvent(): Promise<void> {
    if (!this.newEventTitle) {
      this.message = '请填写必填项'
      return
    }

    // 格式化时间为字符串
    const startTimeStr = this.formatDateTime(this.startTimeDate)
    const endTimeStr = this.formatDateTime(this.endTimeDate)

    const reqData: AddEventReq = {
      title: this.newEventTitle,
      content: this.newEventContent,
      location: this.newLocation,
      start_time: startTimeStr,
      end_time: endTimeStr,
      club_id: this.selectedClubId,
      status: this.newStatus
    }

    const req = http.createHttp()

    try {
      const res = await new Promise((resolve, reject) => {
        req.request(Api.EVENTS, {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: JSON.stringify(reqData)
        }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      }) as http.HttpResponse

      let result: ApiResponse<Event>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string) as ApiResponse<Event>
      } else {
        result = res.result as ApiResponse<Event>
      }

      if (result.code === 0) {
        this.loadEvents()
        this.newEventTitle = ''
        this.newEventContent = ''
        this.newLocation = ''
        this.startTimeDate = new Date()
        this.endTimeDate = new Date()
        this.message = '发布成功'
        setTimeout(() => {
          this.message = ''
        }, 2000)
      } else {
        this.message = result.msg || '发布失败'
      }
    } catch (error) {
      console.error('发布活动失败:', JSON.stringify(error))
      this.message = '网络错误，请重试'
    } finally {
      req.destroy()
    }
  }

  formatDateTime(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  build() {
    Column({ space: 8 }) {
      Text('活动管理').fontSize(24).fontWeight(FontWeight.Bold)

      // 选择社团
      Row() {
        Text('选择社团: ').fontSize(16)
        Select(this.clubs.map(
          (club): SelectOption => ({ value: club.name })
        ))
          .selected(0)
          .onSelect((index: number) => {
            this.selectedClubId = this.clubs[index].id
            this.selectedClubName = this.clubs[index].name
            this.loadEvents()
          })
      }.width('100%').padding({ bottom: 2 })
      // 添加活动表单
      Column({ space: 2 }) {
        Text('发布新活动').fontSize(18).alignSelf(ItemAlign.Start)

        // TextInput({ placeholder: '活动标题*', text: this.newEventTitle })
        //   .onChange(value => this.newEventTitle = value)
        //   .borderRadius(8)
        //   .backgroundColor('#f5f5f5')
        //   .padding({ left: 10, right: 10 })

        Stack({ alignContent: Alignment.Start }) {
          // 底层透明占位的TextInput
          TextInput({ text: this.newEventTitle })
            .width('100%')
            .height(48)
            .border({ width: 1, color: '#E5E5E5', radius: 8 })
            .padding({ left: 12 })
            .placeholderColor(Color.Transparent)
            .onChange((value) => {
              this.newEventTitle = value;
            });

          // 上层Text，输入为空时显示
          if (this.newEventTitle === '') {
            Text() {
              Span('活动标题').fontSize(16);
              Span('*').fontColor(Color.Red).fontSize(16).fontWeight(FontWeight.Bold);
            }
            .padding({ left: 12 })
          }
        }

        TextInput({ placeholder: '活动描述', text: this.newEventContent })
          .onChange(value => this.newEventContent = value)
          .borderRadius(8)
          .backgroundColor('#f5f5f5')
          .padding({ left: 10, right: 10 })

        TextInput({ placeholder: '活动地点', text: this.newLocation })
          .onChange(value => this.newLocation = value)
          .borderRadius(8)
          .backgroundColor('#f5f5f5')
          .padding({ left: 10, right: 10 })

        // 开始时间选择
        // 开始时间选择
        Column() {
          Text(){
            Span("开始时间")
            Span("*").fontColor(Color.Red)
          }.fontSize(14).alignSelf(ItemAlign.Start)
          Row({ space: 10 }) {
            Text(this.formatDateTime(this.startTimeDate))
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor('#f5f5f5')
              .padding({ left: 10, right: 10 })
              .height(40)
              .alignSelf(ItemAlign.Start)
          }

          Button('选择开始时间').margin({ top: 5 }).onClick(() => {
            DatePickerDialog.show({
              selected: this.startTimeDate,
              onDateAccept: (date: Date) => {
                // 临时日期，避免直接修改原数据
                const tempDate = new Date(this.startTimeDate.getTime());
                tempDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

                // 间隔 1 秒后弹出时间选择器
                setTimeout(() => {
                  TimePickerDialog.show({
                    selected: tempDate,
                    useMilitaryTime: true,
                    onAccept: (time: TimePickerResult) => {
                      // 延迟 250ms，等滚动惯性完全停止再取值
                      setTimeout(() => {
                        tempDate.setHours(time.hour, time.minute);
                        tempDate.setSeconds(tempDate.getSeconds() ); // 秒+1
                        this.startTimeDate = tempDate;
                      }, 250);
                    }
                  });
                }, 1000);
              }
            });
          })
        }

        // 结束时间选择
        Column() {
          Text(){
            Span("结束时间")
            Span("*").fontColor(Color.Red)
          }.fontSize(14).alignSelf(ItemAlign.Start)
          Row({ space: 10 }) {
            Text(this.formatDateTime(this.endTimeDate))
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor('#f5f5f5')
              .padding({ left: 10, right: 10 })
              .height(40)
              .alignSelf(ItemAlign.Start)
          }

          Button('选择结束时间').margin({ top: 5 }).onClick(() => {
            DatePickerDialog.show({
              selected: this.endTimeDate,
              onDateAccept: (date: Date) => {
                const tempDate = new Date(this.endTimeDate.getTime());
                tempDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

                setTimeout(() => {
                  TimePickerDialog.show({
                    selected: tempDate,
                    useMilitaryTime: true,
                    onAccept: (time: TimePickerResult) => {
                      setTimeout(() => {
                        tempDate.setHours(time.hour, time.minute);
                        tempDate.setSeconds(tempDate.getSeconds() );//
                        this.endTimeDate = tempDate;
                      }, 250);
                    }
                  });
                }, 1000);
              }
            });
          })
        }

        Row({ space: 3 }) {
          Text('状态').fontSize(14).alignSelf(ItemAlign.Start)
          Toggle({ type: ToggleType.Switch, isOn: this.newStatus === 'draft' })
            .onChange((value: boolean) => {
              this.newStatus = value ? 'draft' : 'published'
            })
          Text(this.newStatus === 'draft' ? '校外活动' : '校内活动').fontSize(14)
        }

        Button('发布活动').width('100%').onClick(() => this.addEvent())
      }.padding(15).borderRadius(8).backgroundColor('#ffffff').shadow({
        radius: 4,
        color: '#e0e0e0',
        offsetX: 0,
        offsetY: 2
      })

      if (this.message) {
        Text(this.message).fontSize(14).fontColor(this.message.includes('成功') ? '#4caf50' : '#f44336')
          .width('100%').textAlign(TextAlign.Center)
      }

      // 活动列表
      Text('活动列表').fontSize(18).alignSelf(ItemAlign.Start).margin({ top: 5 })

      if (this.loading) {
        Text('加载中...').fontSize(16).margin({ top: 5 })
      } else {
        Scroll(){
          List({ space: 5 }) {
            ForEach(this.events, (item: Event) => {
              ListItem() {
                Column({ space: 8 }) {
                  Text(item.title).fontSize(16).fontWeight(FontWeight.Medium)
                  Text(item.content || '无描述').fontSize(14).maxLines(2).textOverflow({ overflow: TextOverflow.Ellipsis })

                  Row({ space: 10 }) {
                    Text(`地点: ${item.location || '未指定'}`).fontSize(12).fontColor('#666')
                    Text(`${item.start_time.substring(0, 16)} - ${item.end_time.substring(0, 16)}`).fontSize(12).fontColor('#666')
                  }

                  Row() {
                    Text(item.status=='draft' ? '校外活动' : '校内活动').fontSize(12).padding({ left: 8, right: 8, top: 4, bottom: 4 })
                      .backgroundColor(item.status === 'published' ? '#4caf50' : '#ff9800')
                      .fontColor('#fff').borderRadius(6)

                    Text(item.created_at ? item.created_at.substring(0, 10) : '').fontSize(12)
                      .fontColor('#999')
                  }
                }.padding(10).width('100%').height(120)
                .borderRadius(8).backgroundColor('#ffffff').shadow({
                  radius: 4,
                  color: '#e0e0e0',
                  offsetX: 0,
                  offsetY: 2
                })
              }
            })
          }.padding({ top: 5 }).cachedCount(20)
        }.width("100%").layoutWeight(1)
      }
    }.padding(20).width('100%').height('100%')
  }
}