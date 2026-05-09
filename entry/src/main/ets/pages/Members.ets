import router from '@ohos.router'
import http from '@ohos.net.http'
import { Api } from '../common/Api'
import { Member, AddMemberReq, ApiResponse, Club } from '../common/types'
import { AppStorageV2 } from '@kit.ArkUI'

@Entry
@Component
struct Members {
  @State members: Member[] = [] // 显示用：当前社团成员
  @State allMembers: Member[] = [] // 查重用：全系统所有成员
  @State newMemberName: string = ''
  @State newStudentId: string = ''
  @State newPhone: string = ''
  @State newRole: string = 'member'
  @State loading: boolean = false
  @State message: string = ''
  @State selectedClubId: number = 1
  @State clubs: Club[] = []
  @State selectedClubName: string = AppStorage.Get<string>('selectedClubName') ?? ''

  // 全局重复提示
  @State isDuplicate: boolean = false
  @State tip: string = ''

  aboutToAppear() {
    this.loadClubs()
    this.loadMembers()
    this.loadAllMembers() // 加载全系统成员 用于查重
  }

  // 加载全系统所有成员只用于判断社团账号重复
  async loadAllMembers() {
    let req = http.createHttp()
    try {
      let res = await req.request(Api.MEMBERS, {
        method: http.RequestMethod.GET,
        header: { 'Content-Type': 'application/json' }
      })

      let result: ApiResponse<Member[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result)
      } else {
        result = { code: -1 } as ApiResponse<Member[]>
      }

      if (result.code === 0 && result.data) {
        this.allMembers = result.data
      }
    } finally {
      req.destroy()
    }
  }

  async loadClubs(): Promise<void> {
    const req = http.createHttp()
    try {
      const res = await new Promise((resolve, reject) => {
        req.request(Api.CLUBS, {
          method: http.RequestMethod.GET,
          header: { 'Content-Type': 'application/json' }
        }, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      }) as http.HttpResponse

      let result: ApiResponse<Club[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string)
      } else {
        result = { code: -1 } as ApiResponse<Club[]>
      }

      if (result.code === 0 && Array.isArray(result.data)) {
        this.clubs = result.data
        if (result.data.length > 0) {
          this.selectedClubId = result.data[0].id
          this.selectedClubName = result.data[0].name
        }
      }
    } finally {
      req.destroy()
    }
  }

  async loadMembers(): Promise<void> {
    this.loading = true
    const req = http.createHttp()
    try {
      const res = await new Promise((resolve, reject) => {
        req.request(`${Api.MEMBERS}?club_id=${this.selectedClubId}`, {
          method: http.RequestMethod.GET,
          header: { 'Content-Type': 'application/json' }
        }, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      }) as http.HttpResponse

      let result: ApiResponse<Member[]>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string)
      } else {
        result = { code: -1 } as ApiResponse<Member[]>
      }

      if (result.code === 0 && Array.isArray(result.data)) {
        this.members = result.data
      }
    } finally {
      this.loading = false
      req.destroy()
    }
  }

// 整个系统有就禁止

  checkDuplicate() {
    if (!this.newStudentId) {
      this.isDuplicate = false
      this.tip = ''
      return
    }

    let exist = this.allMembers.some(m => m.student_id == this.newStudentId.trim())

    if (exist) {
      this.isDuplicate = true
      this.tip = "该社团账号已在系统中存在，无法添加"
    } else {
      this.isDuplicate = false
      this.tip = ""
    }
  }

  async addMember(): Promise<void> {
    if (this.isDuplicate) {
      this.message = "社团账号重复，请更换"
      return
    }
    if (!this.newMemberName || !this.newStudentId) {
      this.message = "请填写必填项"
      return
    }

    const reqData: AddMemberReq = {
      name: this.newMemberName,
      student_id: this.newStudentId,
      phone: this.newPhone,
      club_id: this.selectedClubId,
      role: this.newRole
    }

    const req = http.createHttp()
    try {
      const res = await new Promise((resolve, reject) => {
        req.request(Api.MEMBERS, {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: JSON.stringify(reqData)
        }, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      }) as http.HttpResponse

      let result: ApiResponse<Member>
      if (typeof res.result === 'string') {
        result = JSON.parse(res.result as string)
      } else {
        result = { code: -1 } as ApiResponse<Member>
      }

      if (result.code === 0) {
        this.loadMembers()
        this.loadAllMembers() // 重新加载全系统成员
        this.newMemberName = ''
        this.newStudentId = ''
        this.newPhone = ''
        this.message = '添加成功'
        setTimeout(() => this.message = '', 2000)
      } else {
        this.message = result.msg || '添加失败'
      }
    } finally {
      req.destroy()
    }
  }

  build() {
    Column({ space: 15 }) {
      Text('成员管理').fontSize(24).fontWeight(FontWeight.Bold)

      Row() {
        Text('选择社团: ').fontSize(16)
        Select(this.clubs.map(club => ({
          value: club.name,
          text: club.name
        } as SelectOption)))
          .selected(0)
          .onSelect((index: number) => {
            this.selectedClubId = this.clubs[index].id
            this.selectedClubName = this.clubs[index].name
            this.loadMembers()
          })
      }.width('100%')

      Column({ space: 10 }) {
        Text('添加新成员').fontSize(18)
        Column({ space: 5 }) {
          Text(){
            Span("姓名")
            Span("*").fontColor(Color.Red)
          }.fontSize(14)
          TextInput({ placeholder: '请输入姓名', text: this.newMemberName })
            .onChange(v => this.newMemberName = v)
            .borderRadius(8)
            .backgroundColor('#f5f5f5')
            .padding({ left: 10, right: 10 })

          Text(){
            Span("社团账号")
            Span("*").fontColor(Color.Red)
          }.fontSize(14)
          TextInput({ placeholder: '请输入社团账号', text: this.newStudentId })
            .onChange(v => {
              this.newStudentId = v
              this.checkDuplicate()
            })
            .borderRadius(8)
            .backgroundColor('#f5f5f5')
            .padding({ left: 10, right: 10 })

          if (this.isDuplicate) {
            Text(this.tip)
              .fontColor('#fff')
              .backgroundColor('#f44336')
              .padding(3)
              .borderRadius(4)
              .margin({ top: 4 })
          }
        }

        TextInput({ placeholder: '电话', text: this.newPhone })
          .onChange(v => this.newPhone = v)
          .borderRadius(8)
          .backgroundColor('#f5f5f5')
          .padding({ left: 10, right: 10 })

        Row({ space: 10 }) {
          Text('角色').fontSize(14)
          Toggle({ type: ToggleType.Switch, isOn: this.newRole === 'admin' })
            .onChange(v => this.newRole = v ? 'admin' : 'member')
          Text(this.newRole === 'admin' ? '校内人员' : '校外人员')
        }

        Button('添加成员')
          .width('100%')
          .enabled(!this.isDuplicate)
          .backgroundColor(this.isDuplicate ? '#ccc' : '#0070cc')
          .onClick(() => this.addMember())
      }
      .padding(15)
      .backgroundColor('#fff')
      .borderRadius(8)

      if (this.message) {
        Text(this.message)
          .fontColor(this.message.includes('成功') ? '#4caf50' : '#f44336')
      }

      // 成员列表
      Text('成员列表').fontSize(18)
      if (this.loading) {
        Text('加载中...')
      } else {
        Scroll() {
          List({ space: 5 }) {
            ForEach(this.members, (item: Member) => {
              ListItem() {
                Row({ space: 15 }) {
                  Column({ space: 4 }) {
                    Text(item.name).fontSize(16)
                    Text(`社团账号: ${item.student_id}`).fontColor('#666')
                    Text(`电话: ${item.phone || '未填写'}`).fontColor('#666')
                  }
                  .layoutWeight(1)

                  Text(item.role == 'admin' ? '校内人员' : '校外人员')
                    .backgroundColor(item.role === 'admin' ? '#ff9800' : '#e0e0e0')
                    .padding(5)
                    .borderRadius(12)
                }
                .padding(10)
                .backgroundColor('#fff')
                .borderRadius(8)
                .width('100%')
              }
            })
          }
          .width('100%')
          .padding({ bottom: 10 })
        }
        .layoutWeight(1) // 核心：让滚动区域生效
        .width('100%')
      }
    }.padding(20).width('100%').height('100%')
  }
}

interface SelectOption {
  value: string;
  text: string;
}