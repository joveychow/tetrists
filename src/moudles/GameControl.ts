import Bricks from "./Bricks";
import GlobalData from "../GlobalData";
class GameControl { // 常量    
    // 16宫格所在的位置
    currentX = 0;
    currentY = 0;

    // 定时器
    mInterval = null;

    brick: Bricks;

    constructor() {
        this.brick = new Bricks(this.currentX, this.currentY, GlobalData.STEP);
        this.init();
    }

    init() {
        document.addEventListener("keydown", this.keyDownHandler.bind(this));
        // 自动降落
        this.autoDown();
    }

    keyDownHandler(evt: KeyboardEvent) {
        switch (evt.key) {
            case "ArrowUp":
            case "Up": this.brick.rotate(); break;
            case "ArrowDown":
            case "ADown": this.brick.move(0, 1); break;
            case "ArrowLeft":
            case "Left": this.brick.move(-1, 0); break;
            case "ArrowRight":
            case "Right": this.brick.move(1, 0); break;
        }
    }



    // 让模型自动下落
    autoDown() {
        if (this.mInterval) {
            clearInterval(this.mInterval);
        }
        if (GlobalData.ISLIVE) {
            this.mInterval = <any>setInterval(this.moveHandler.bind(this), 600);
        }

    }

    moveHandler() {
        if (this.isGameOver()) {
            GlobalData.ISLIVE = false;
            this.gameOver();
            return;
        }
        this.brick.move(0, 1);
    }

    // 判断游戏结束
    isGameOver() {
        // 当第0行存在块元素表示游戏结束
        for (var i = 0; i < GlobalData.COL_COUNT; i++) {
            if (this.brick.fixedBlocks["0_" + i]) {
                return true;
            }
        }
    }

    // 结束掉游戏
    gameOver() {
        // 1、停止定时器
        if (this.mInterval) {
            clearInterval(this.mInterval)
        };
        // 2、弹出对话框，告诉用户游戏结束了
        alert("大吉大利，今晚吃鸡");
    }
}

export default GameControl;