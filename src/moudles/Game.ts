import GameControl from "./GameControl";
import GlobalData from "../GlobalData";
class Game {
    constructor() {
        this.init();
    }
    init() {
        this.createBg();
        new GameControl();
    }
    //创建格子背景
    createBg() {
        for (let i = 0; i < GlobalData.ROW_COUNT; i++) {
            for (let j = 0; j < GlobalData.COL_COUNT; j++) {
                var divEle = document.createElement("div");
                var container = document.getElementById("stage-bg") as HTMLElement;
                container.appendChild(divEle);
            }

        }

    }

}
export default Game;