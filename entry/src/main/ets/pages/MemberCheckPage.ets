import router from '@ohos.router'
import http from '@ohos.net.http'
import promptAction from '@ohos.promptAction'

import { Api } from '../common/Api'

import {
  Member,
  AddMemberReq,
  ApiResponse,
  Club,
  UpdateMemberReq,
  DeleteResponse
} from '../common/types'

import { AppStorageV2 } from '@kit.ArkUI'

@Entry
@Component
struct MembersCheckPage {

  @State members: Member[] = []
  @State allMembers: Member[] = []

  @State newMemberName: string = ''
  @State newStudentId: string = ''
  @State newPhone: string = ''
  @State newRole: string = 'member'

  @State loading: boolean = false
  @State message: string = ''

  @State selectedClubId: number = 1
  @State clubs: Club[] = []

  @State selectedClubName: string =
    AppStorage.Get<string>('selectedClubName') ?? ''

  @State isDuplicate: boolean = false
  @State tip: string = ''

  // 搜索
  @State searchName: string = ''

  // 修改弹窗
  @State showEditDialog: boolean = false
  @State editName: string = ''
  @State editStudentId: string = ''
  @State editMemberId: number = 0

  aboutToAppear() {
    this.loadClubs()
    this.loadAllMembers()
  }

  async loadAllMembers() {
    let req = http.createHttp()

    try {

      let res = await req.request(Api.MEMBERS, {
        method: http.RequestMethod.GET,
        header: {
          'Content-Type': 'application/json'
        }
      })

      let result: ApiResponse<Member[]>

      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<Member[]>
      } else {
        result = {
          code: -1,
          msg: '数据解析失败'
        }
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

      const res = await new Promise<http.HttpResponse>((resolve, reject) => {

        req.request(Api.CLUBS, {
          method: http.RequestMethod.GET,
          header: {
            'Content-Type': 'application/json'
          }
        }, (err: Error, data: http.HttpResponse) => {

          if (err) {
            reject(err)
          } else {
            resolve(data)
          }

        })

      })

      let result: ApiResponse<Club[]>

      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<Club[]>
      } else {
        result = {
          code: -1,
          msg: '数据解析失败'
        }
      }

      if (result.code === 0 && result.data) {

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

    if (!this.searchName.trim()) {
      promptAction.showToast({ message: '请输入搜索姓名', duration: 2000 })
      return
    }

    this.loading = true

    const req = http.createHttp()

    try {

      const url =
        `${Api.MEMBER_CHECK_SEARCH}?name=${encodeURIComponent(this.searchName)}`
      const res = await new Promise<http.HttpResponse>((resolve, reject) => {

        req.request(url, {
          method: http.RequestMethod.GET,
          header: {
            'Content-Type': 'application/json'
          }
        }, (err: Error, data: http.HttpResponse) => {

          if (err) {
            reject(err)
          } else {
            resolve(data)
          }

        })

      })

      let result: ApiResponse<Member[]>

      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as ApiResponse<Member[]>
      } else {
        result = {
          code: -1,
          msg: '数据解析失败'
        }
      }

      if (result.code === 0 && result.data) {
        if (result.data.length > 0) {
          this.members = result.data
        } else {
          this.members = []
          promptAction.showToast({ message: '搜索内容为空', duration: 2000 })
        }
      }

    } finally {

      this.loading = false
      req.destroy()

    }
  }

  checkDuplicate() {

    if (!this.newStudentId) {

      this.isDuplicate = false
      this.tip = ''

      return
    }

    let exist = this.allMembers.some(
      m => m.student_id == this.newStudentId.trim()
    )

    if (exist) {

      this.isDuplicate = true
      this.tip = "该社团账号已在系统中存在"

    } else {

      this.isDuplicate = false
      this.tip = ""

    }
  }

  async deleteMember(id: number): Promise<void> {

    const req = http.createHttp()

    try {

      const res = await new Promise<http.HttpResponse>((resolve, reject) => {

        req.request(`${Api.MEMBER_CHECK_DELETE}/${id}`, {
          method: http.RequestMethod.DELETE,
          header: {
            'Content-Type': 'application/json'
          }
        }, (err: Error, data: http.HttpResponse) => {

          if (err) {
            reject(err)
          } else {
            resolve(data)
          }

        })

      })

      let result: DeleteResponse

      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as DeleteResponse
      } else {
        result = { code: -1 }
      }

      if (result.code === 0) {

        promptAction.showToast({
          message: '删除成功'
        })

        this.loadMembers()

      }

    } finally {

      req.destroy()

    }
  }

  openEditDialog(item: Member) {

    this.editMemberId = item.id
    this.editName = item.name
    this.editStudentId = item.student_id
    this.showEditDialog = true

  }

  async updateMember(): Promise<void> {

    const reqData: UpdateMemberReq = {
      name: this.editName,
      student_id: this.editStudentId
    }

    const req = http.createHttp()

    try {

      const res = await new Promise<http.HttpResponse>((resolve, reject) => {

        req.request(
          `${Api.MEMBER_CHECK_UPDATE}/${this.editMemberId}`,
          {
            method: http.RequestMethod.PUT,
            header: {
              'Content-Type': 'application/json'
            },
            extraData: JSON.stringify(reqData)
          },
          (err: Error, data: http.HttpResponse) => {

            if (err) {
              reject(err)
            } else {
              resolve(data)
            }

          }
        )

      })

      let result: DeleteResponse

      if (typeof res.result === 'string') {
        result = JSON.parse(res.result) as DeleteResponse
      } else {
        result = { code: -1 }
      }

      if (result.code === 0) {

        promptAction.showToast({
          message: '修改成功'
        })

        this.showEditDialog = false

        this.loadMembers()

      }

    } finally {

      req.destroy()

    }
  }

  build() {

    Column({ space: 8 }) {

      Text('成员管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)

      // 搜索框

      Row({ space: 10 }) {

        TextInput({
          placeholder: '输入姓名搜索',
          text: this.searchName
        })
          .layoutWeight(1)
          .backgroundColor('#f5f5f5')
          .borderRadius(8)
          .onChange(v => {
            this.searchName = v
          })

        Button('搜索')
          .onClick(() => {
            this.loadMembers()
          })

      }

      // 成员列表

      List({ space: 10 }) {

        ForEach(this.members, (item: Member) => {

          ListItem() {

            Column({ space: 10 }) {

              Row() {

                Column({ space: 5 }) {

                  Text(item.name)
                    .fontSize(18)

                  Text(`社团账号: ${item.student_id}`)
                    .fontColor('#666')

                }
                .layoutWeight(1)
                .alignItems(HorizontalAlign.Start)

                Column({ space: 8 }) {

                  Button('修改')
                    .backgroundColor('#007DFF')
                    .onClick(() => {
                      this.openEditDialog(item)
                    })

                  Button('删除')
                    .backgroundColor('#f44336')
                    .onClick(() => {
                      this.deleteMember(item.id)
                    })

                }

              }
              .width('100%')

            }
            .padding(15)
            .backgroundColor('#fff')
            .borderRadius(10)

          }

        })

      }
      .layoutWeight(1)
      .width('100%')

    }
    .padding({ left: 20, right: 20, top: 10, bottom: 20 })
    .width('100%')
    .height('100%')
    .bindContentCover(
      this.showEditDialog,
      this.editDialog(),
      {
        modalTransition: ModalTransition.DEFAULT
      }
    )
  }

  @Builder
  editDialog() {

    Column() {

      Column({ space: 20 }) {

        Text('修改成员信息')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)

        TextInput({
          placeholder: '输入新的姓名',
          text: this.editName
        })
          .onChange(v => {
            this.editName = v
          })
          .backgroundColor('#f5f5f5')
          .borderRadius(8)

        TextInput({
          placeholder: '输入新的社团账号',
          text: this.editStudentId
        })
          .onChange(v => {
            this.editStudentId = v
          })
          .backgroundColor('#f5f5f5')
          .borderRadius(8)

        Row({ space: 10 }) {

          Button('取消')
            .layoutWeight(1)
            .backgroundColor('#999')
            .onClick(() => {
              this.showEditDialog = false
            })

          Button('确定')
            .layoutWeight(1)
            .backgroundColor('#007DFF')
            .onClick(() => {
              this.updateMember()
            })

        }

      }
      .padding(20)
      .width('80%')
      .backgroundColor('#fff')
      .borderRadius(15)

    }
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0,0,0,0.35)')
  }
}