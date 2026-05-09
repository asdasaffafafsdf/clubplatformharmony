import UIAbility from "@ohos:app.ability.UIAbility";
import type window from "@ohos:window";
import type { BusinessError } from "@ohos:base";
export default class EntryAbility extends UIAbility {
    onWindowStageCreate(windowStage: window.WindowStage): void {
        windowStage.loadContent('pages/Login', (err: BusinessError) => {
            if (err.code) {
                console.error(err.message);
            }
        });
    }
}
