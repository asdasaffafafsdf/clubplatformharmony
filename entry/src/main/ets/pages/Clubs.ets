import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { Club, AddClubReq, ApiResponse } from '../common/types'

@Entry
@Component
struct Clubs {
  @State clubs: Club[] = []
  @State newClubName: string = ''
  @State newDescription: string = ''
  @State loading: boolean = false
  @State message: string = ''

  aboutToAppear() {
    this.loadClubs()
  }

  async loadClubs(): Promise<void> {
    this.loading = true
    const req = http.createHttp()

    try {
      const res = await new Promise((resolve, reject) => {
        req.request(Api.CLUBS, {
          method: http.RequestMethod.GET,
          header: { 'Content-Type': 'application/json' }
        }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      }) as http.HttpResponse

      let result: ApiResponse<Club[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string) as ApiResponse<Club[]>
      } else {
        result = res.result as ApiResponse<Club[]>
      }

      if (result.code === 0 && Array.isArray(result.data)) {
        this.clubs = result.data
      } else {
        this.message = result.msg || '加载社团失败'
      }
    } catch (error) {
      console.error('加载社团失败:', JSON.stringify(error))
      this.message = '网络错误，请重试'
    } finally {
      this.loading = false
      req.destroy()
    }
  }

  async addClub(): Promise<void> {
    if (!this.newClubName) {
      this.message = '请输入社团名称'
      return
    }

    const reqData: AddClubReq = {
      name: this.newClubName,
      description: this.newDescription
    }

    const req = http.createHttp()

    try {
      const res = await new Promise((resolve, reject) => {
        req.request(Api.CLUBS, {
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

      let result: ApiResponse<Club>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string) as ApiResponse<Club>
      } else {
        result = res.result as ApiResponse<Club>
      }

      if (result.code === 0) {
        this.loadClubs()
        this.newClubName = ''
        this.newDescription = ''
        this.message = '创建成功'
        setTimeout(() => {
          this.message = ''
        }, 2000)
      } else {
        this.message = result.msg || '创建失败'
      }
    } catch (error) {
      console.error('创建社团失败:', JSON.stringify(error))
      this.message = '网络错误，请重试'
    } finally {
      req.destroy()
    }
  }

  build() {
    Column({ space: 15 }) {
      Text('社团管理').fontSize(24).fontWeight(FontWeight.Bold)

      // 创建社团表单
      Column({ space: 10 }) {
        Text('创建新社团').fontSize(18).alignSelf(ItemAlign.Start)

        Column() {
          Text(){
            Span("社团名称")

            Span("*")
              .fontColor(Color.Red) // 蓝色
          }.fontSize(14).alignSelf(ItemAlign.Start)
          TextInput({ placeholder: '请输入社团名称', text: this.newClubName })
            .onChange(value => this.newClubName = value)
            .borderRadius(8)
            .backgroundColor('#f5f5f5')
            .padding({ left: 10, right: 10 })
        }

        Column() {
          Text('社团描述').fontSize(14).alignSelf(ItemAlign.Start)
          TextInput({ placeholder: '请输入社团描述', text: this.newDescription })
            .onChange(value => this.newDescription = value)
            .borderRadius(8)
            .backgroundColor('#f5f5f5')
            .padding({ left: 10, right: 10 })
        }

        Button('创建社团').width('100%').onClick(() => this.addClub())
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

      // 社团列表
      Text('社团列表').fontSize(18).alignSelf(ItemAlign.Start).margin({ top: 1 })

      if (this.loading) {
        Text('加载中...').fontSize(16).margin({ top: 20 })
      } else {
     // Scroll(){
         List({ space: 5 }) {
           ForEach(this.clubs, (item: Club) => {
             ListItem() {
               Column({ space: 8 }) {
                 Text(item.name).fontSize(16).fontWeight(FontWeight.Medium)
                 if (item.description) {
                   Text(item.description).fontSize(14).maxLines(2).textOverflow({ overflow: TextOverflow.Ellipsis })
                 }
                 Text(`创建于: ${item.created_at ? item.created_at.substring(0, 10) : ''}`).fontSize(12)
                   .fontColor('#999')
               }.padding(10).width('100%').height(80)
               .borderRadius(8).backgroundColor('#ffffff').shadow({
                 radius: 4,
                 color: '#e0e0e0',
                 offsetX: 0,
                 offsetY: 2
               })
               .onClick(() => {
                 // 可以跳转到社团详情页或设置当前选中的社团
                 AppStorage.SetOrCreate('currentClubId', item.id)
                 this.message = `已选择社团: ${item.name}`
                 setTimeout(() => {
                   this.message = ''
                 }, 2000)
               })
             }
           })
         }.padding({ top: 1 }).cachedCount(20)
      // }.layoutWeight(1)
      }
    }.padding(20).width('100%').height('100%')
  }
}