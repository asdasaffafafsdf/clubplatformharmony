import UIAbility from '@ohos.app.ability.UIAbility'
import window from '@ohos.window'
import { BusinessError } from '@ohos.base'

export default class EntryAbility extends UIAbility {

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Login', (err: BusinessError) => {
      if (err.code) {
        console.error(err.message)
      }
    })
  }
}